pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "@zk-email/contracts/DKIMRegistry.sol";
import "../src/ProofOfTwitter.sol";
import "../src/Verifier.sol";

contract TwitterUtilsTest is Test {
    using StringUtils for *;

    Verifier proofVerifier;
    DKIMRegistry dkimRegistry;
    ProofOfTwitter testVerifier;

    uint16 public constant packSize = 7;

    function setUp() public {
        address owner = vm.addr(1);

        vm.startPrank(owner);

        proofVerifier = new Verifier();
        dkimRegistry = new DKIMRegistry(owner);

        // These are the Poseidon hash of DKIM public keys for x.com
        // This was calcualted using https://github.com/zkemail/zk-email-verify/tree/main/packages/scripts
        dkimRegistry.setDKIMPublicKeyHash(
            "x.com",
            bytes32(uint256(14900978865743571023141723682019198695580050511337677317524514528673897510335))
        );
        dkimRegistry.setDKIMPublicKeyHash(
            "x.com",
            bytes32(uint256(1983664618407009423875829639306275185491946247764487749439145140682408188330))
        );

        testVerifier = new ProofOfTwitter(proofVerifier, dkimRegistry);

        vm.stopPrank();
    }

    // function testMint() public {
    //   testVerifier.mint
    // }

    // Should pass (note that there are extra 0 bytes, which are filtered out but should be noted in audits)
    function testUnpack1() public {
        uint256[] memory packedBytes = new uint256[](3);
        packedBytes[0] = 29096824819513600;
        packedBytes[1] = 0;
        packedBytes[2] = 0;

        // This is 0x797573685f670000000000000000000000000000000000000000000000000000
        // packSize = 7
        string memory byteList = StringUtils.convertPackedBytesToString(
            packedBytes,
            15,
            packSize
        );
        // This is 0x797573685f67, since strings are internally arbitrary length arrays
        string memory intended_value = "yush_g";

        // We need to cast both to bytes32, which works since usernames can be at most 15, alphanumeric + '_' characters
        // Note that this may not generalize to non-ascii characters.
        // Weird characters are allowed in email addresses, see https://en.wikipedia.org/wiki/Email_address#Local-part
        // See https://stackoverflow.com/a/2049510/3977093 -- you can even have international characters with RFC 6532
        // Our regex should just disallow most of these emails, but they may end up taking more than two bytes
        // ASCII should fit in 2 bytes but emails may not be ASCII
        assertEq(bytes32(bytes(byteList)), bytes32(bytes(intended_value)));
        assertEq(byteList, intended_value);
        console.logString(byteList);
    }

    function testUnpack2() public {
        uint256[] memory packedBytes = new uint256[](3);
        packedBytes[0] = 28557011619965818;
        packedBytes[1] = 1818845549;
        packedBytes[2] = 0;
        string memory byteList = StringUtils.convertPackedBytesToString(
            packedBytes,
            15,
            packSize
        );
        string memory intended_value = "zktestemail";
        assertEq(bytes32(bytes(byteList)), bytes32(bytes(intended_value)));
        console.logString(byteList);
    }

    // These proof and public input values are generated using scripts in packages/circuits/scripts/generate-proof.ts
    // The sample email in `/emls` is used as the input, but you will have different values if you generated your own zkeys
    function proofTestData() internal view returns (
        uint256[3] memory publicSignals,
        uint256[8] memory proof
    ) {
        publicSignals[0] = 1983664618407009423875829639306275185491946247764487749439145140682408188330;
        publicSignals[1] = 60688095039584876602025332;
        publicSignals[2] = 939406481697058082851001177880059329846108047162;

        uint256[2] memory proof_a = [
            2009445536733820940614696809993322277245951542303198989655358849969062470372,
            8816577960801104870014601849299786208491980694496377614657829475846590189044
        ];
        // Note: you need to swap the order of the two elements in each subarray
        uint256[2][2] memory proof_b = [
            [
                14855789773713162959395469568085738009479688945606671646123078952384187715749,
                5537551629211653307129736243267704849501872155474305257425810771375879194045
            ],
            [
                1132186781256405271827663020181423082108968049637269513640889795929913374755,
                20283187854758064375389662408752458008801719101365442241161112666095010479777
            ]
        ];
        uint256[2] memory proof_c = [
            5044973743340357316712989815484977055865277059347265143314644500926851858180,
            11111706666208986243818708247898127453788585043016564128696584275645826038016
        ];

        proof = [
            proof_a[0],
            proof_a[1],
            proof_b[0][0],
            proof_b[0][1],
            proof_b[1][0],
            proof_b[1][1],
            proof_c[0],
            proof_c[1]
        ];

        // Test proof verification
        bool verified = proofVerifier.verifyProof(
            proof_a,
            proof_b,
            proof_c,
            publicSignals
        );
        assertEq(verified, true);
    }

    // Need two proofs for the same account to test inactivity
    function proofTestData2() internal view returns (
        uint256[3] memory publicSignals,
        uint256[8] memory proof
    ) {
        publicSignals[0] = 1983664618407009423875829639306275185491946247764487749439145140682408188330;
        publicSignals[1] = 60688095039584876602025332;
        publicSignals[2] = 939406481697058082851001177880059329846108047162;

        uint256[2] memory proof_a = [
            7799039678913605710259821229942352464082220364020014946144130184928336196865,
            12130394184898533762274334952424785094770793233409037588953920933439195731442
        ];
        // Note: you need to swap the order of the two elements in each subarray
        uint256[2][2] memory proof_b = [
            [
                20482212462660099379624491309707025656117065161929921230598395801723983742613,
                6090631549061757191387350641326752562101523174229830619865248275166199071666
            ],
            [
                7614549401779143625809358345392036412871867684423898593516000263403520566181,
                9130965690958350324179373283450055322497354099003455526448543990473093311817
            ]
        ];
        uint256[2] memory proof_c = [
            1537938571189380464959355373094939980865238915155273757911400383684934917,
            17243504316948413489100276038947070591642744340336274718832513702927574205343
        ];

        proof = [
            proof_a[0],
            proof_a[1],
            proof_b[0][0],
            proof_b[0][1],
            proof_b[1][0],
            proof_b[1][1],
            proof_c[0],
            proof_c[1]
        ];

        // Test proof verification
        bool verified = proofVerifier.verifyProof(
            proof_a,
            proof_b,
            proof_c,
            publicSignals
        );
        assertEq(verified, true);
    }

    function proofTestUsername() public pure returns (string memory) {
      return "test_zk9432";
    }

    function testVerifyTestEmail() public {
        (uint256[3] memory publicSignals, uint256[8] memory proof) = proofTestData();
        // Test mint after spoofing msg.sender
        vm.startPrank(0x0000000000000000000000000000000000000001);
        testVerifier.mint(proof, publicSignals);
        vm.stopPrank();
    }

    function testSVG() public {
        testVerifyTestEmail();
        string memory svgValue = testVerifier.tokenURI(1);
        console.log(svgValue);
        assert(bytes(svgValue).length > 0);
    }

    function testDuplicateProofHash() public {
        (uint256[3] memory publicSignals, uint256[8] memory proof) = proofTestData();
        // Test mint after spoofing msg.sender
        vm.startPrank(0x0000000000000000000000000000000000000001);

        testVerifier.mint(proof, publicSignals);

        vm.expectRevert("duplicate proof hash");
        testVerifier.mint(proof, publicSignals);

        vm.stopPrank();
    }

    function testInactive() public {
        (uint256[3] memory publicSignals1, uint256[8] memory proof1) = proofTestData();
        (uint256[3] memory publicSignals2, uint256[8] memory proof2) = proofTestData2();
        string memory username = proofTestUsername();
        // Test mint after spoofing msg.sender
        vm.startPrank(0x0000000000000000000000000000000000000001);

        // Mint first NFT
        testVerifier.mint(proof1, publicSignals1);

        // TokenID 0 does not exist, will always be inactive
        assertEq(testVerifier.tokenActive(0), false);
        // First NFT is active
        assertEq(testVerifier.tokenActive(1), true);
        // Username resolves to first NFT
        assertEq(testVerifier.nameToTokenID(username), 1);
        // NFT resolves to username
        assertEq(testVerifier.tokenIDToName(1), username);

        // Mint second NFT for the same username
        testVerifier.mint(proof2, publicSignals2);

        // Both NFTs resolve to username
        assertEq(testVerifier.tokenIDToName(1), username);
        assertEq(testVerifier.tokenIDToName(2), username);
        // Username now resolves to second NFT
        assertEq(testVerifier.nameToTokenID(username), 2);
        // Second NFT is now active
        assertEq(testVerifier.tokenActive(2), true);
        // First NFT is now inactive
        assertEq(testVerifier.tokenActive(1), false);

        vm.stopPrank();

        // TokenID 0 does not exist
        vm.expectRevert();
        testVerifier.tokenDesc(0);

        // For manual verification
        console.log(testVerifier.tokenDesc(1));
        console.log(testVerifier.tokenDesc(2));
    }

    function testChainID() public view {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        console.log(chainId);
        // Local chain, xdai, goerli, mainnet
        assert(
            chainId == 31337 || chainId == 100 || chainId == 5 || chainId == 1
        );
    }
}
