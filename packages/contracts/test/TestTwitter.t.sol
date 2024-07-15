pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "@zk-email/contracts/DKIMRegistry.sol";
import "../src/ProofOfTwitter.sol";
import "../src/Verifier.sol";

contract TwitterUtilsTest is Test {
    using StringUtils for *;

    address constant VM_ADDR = 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D; // Hardcoded address of the VM from foundry

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
    function testVerifyTestEmail() public {
        uint256[3] memory publicSignals;
        publicSignals[
            0
        ] = 1983664618407009423875829639306275185491946247764487749439145140682408188330;
        publicSignals[1] = 131061634216091175196322682;
        publicSignals[2] = 1163446621798851219159656704542204983322218017645;

        uint256[2] memory proof_a = [
            3640944474395694725997243759485841281957193312051963127476944002118802846846,
            12944550183026778008163990773063308425923478727963224679176331024763573701239
        ];
        // Note: you need to swap the order of the two elements in each subarray
        uint256[2][2] memory proof_b = [
            [
                10523456350415273945424632760608655383131363971581062129080466479508555080398,
                331197707211751801275197709958580935302689167865628614323553219143124201916
            ],
            [
                1972650478757937359418230607673029701916211913722571079758270763366511464829,
                4348920096466422800547725696424734715037604091150017141469126675576995757268
            ]
        ];
        uint256[2] memory proof_c = [
            300422780809443960202464842492214800226895503246789474221004192156031237272,
            10211818721022453551274836034175178964506392482691605135120369518092025537245
        ];

        uint256[8] memory proof = [
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

        // Test mint after spoofing msg.sender
        Vm vm = Vm(VM_ADDR);
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
