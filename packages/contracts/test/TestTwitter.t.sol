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
        proofVerifier = new Verifier();
        dkimRegistry = new DKIMRegistry();

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
            8560515785464264484566975251793601340764569587346456836887462574095272861109,
            9187213949652534260402406992756428277971510758385929929393362206660112986577
        ];
        // Note: you need to swap the order of the two elements in each subarray
        uint256[2][2] memory proof_b = [
            [
                4622418497485476916317506827917430058883769016004496189211095203943796358240,
                1486080943321564848486974282840661162948885585134536897142796223606316279220
            ],
            [
                16036348385538987582074595152306129305342020105012444996767041124014470746773,
                11682939184801245044140099548815007763750418101414768278298851687451602118562
            ]
        ];
        uint256[2] memory proof_c = [
            5945751468291848331115504470783768396549824438334575486526039341389473938784,
            20682598462898495943003708847117032729823288172023493416264967628353000523940
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
