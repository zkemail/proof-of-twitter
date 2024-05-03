pragma circom 2.1.5;

include "@zk-email/zk-regex-circom/circuits/common/from_addr_regex.circom";
include "@zk-email/circuits/email-verifier.circom";
include "@zk-email/circuits/utils/regex.circom";
include "./twitter-reset-regex.circom";


/// @title TwitterVerifier
/// @notice Circuit to verify input email matches Twitter password reset email, and extract the username
/// @param maxHeadersLength Maximum length for the email header.
/// @param maxBodyLength Maximum length for the email body.
/// @param n Number of bits per chunk the RSA key is split into. Recommended to be 121.
/// @param k Number of chunks the RSA key is split into. Recommended to be 17.
/// @param exposeFrom Flag to expose the from email address (not necessary for verification). We don't expose `to` as its not always signed.
/// @input emailHeader Email headers that are signed (ones in `DKIM-Signature` header) as ASCII int[], padded as per SHA-256 block size.
/// @input emailHeaderLength Length of the email header including the SHA-256 padding.
/// @input pubkey RSA public key split into k chunks of n bits each.
/// @input signature RSA signature split into k chunks of n bits each.
/// @input emailBody Email body after the precomputed SHA as ASCII int[], padded as per SHA-256 block size.
/// @input emailBodyLength Length of the email body including the SHA-256 padding.
/// @input bodyHashIndex Index of the body hash `bh` in the emailHeader.
/// @input precomputedSHA Precomputed SHA-256 hash of the email body till the bodyHashIndex.
/// @input twitterUsernameIndex Index of the Twitter username in the email body.
/// @input address ETH address as identity commitment (to make it as part of the proof).
/// @output pubkeyHash Poseidon hash of the pubkey - Poseidon(n/2)(n/2 chunks of pubkey with k*2 bits per chunk).
template TwitterVerifier(maxHeadersLength, maxBodyLength, n, k, exposeFrom) {
    assert(exposeFrom < 2);

    signal input emailHeader[maxHeadersLength];
    signal input emailHeaderLength;
    signal input pubkey[k];
    signal input signature[k];
    signal input emailBody[maxBodyLength];
    signal input emailBodyLength;
    signal input bodyHashIndex;
    signal input precomputedSHA[32];
    signal input twitterUsernameIndex;
    signal input address; // we don't need to constrain the + 1 due to https://geometry.xyz/notebook/groth16-malleability


    signal output pubkeyHash;
    signal output twitterUsername;


    component EV = EmailVerifier(maxHeadersLength, maxBodyLength, n, k, 0);
    EV.emailHeader <== emailHeader;
    EV.pubkey <== pubkey;
    EV.signature <== signature;
    EV.emailHeaderLength <== emailHeaderLength;
    EV.bodyHashIndex <== bodyHashIndex;
    EV.precomputedSHA <== precomputedSHA;
    EV.emailBody <== emailBody;
    EV.emailBodyLength <== emailBodyLength;

    pubkeyHash <== EV.pubkeyHash;


    // FROM HEADER REGEX: 736,553 constraints
    if (exposeFrom) {
        signal input fromEmailIndex;

        signal (fromEmailFound, fromEmailReveal[maxHeadersLength]) <== FromAddrRegex(maxHeadersLength)(emailHeader);
        fromEmailFound === 1;

        var maxEmailLength = 255;

        signal output fromEmailAddrPacks[9] <== PackRegexReveal(maxHeadersLength, maxEmailLength)(fromEmailReveal, fromEmailIndex);
    }


    // TWITTER REGEX: 328,044 constraints
    // This computes the regex states on each character in the email body. For other apps, this is the
    // section that you want to swap out via using the zk-regex library.
    signal (twitterFound, twitterReveal[maxBodyLength]) <== TwitterResetRegex(maxBodyLength)(emailBody);
    twitterFound === 1;

    // Pack the username to int
    var maxTwitterUsernameLength = 21;
    signal twitterUsernamePacks[1] <== PackRegexReveal(maxBodyLength, maxTwitterUsernameLength)(twitterReveal, twitterUsernameIndex);
   
    // Username will fit in one field element, so we take the first item from the packed array.
    twitterUsername <== twitterUsernamePacks[0];
}


component main { public [ address ] } = TwitterVerifier(1024, 1536, 121, 17, 0);
