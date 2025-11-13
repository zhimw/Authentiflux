// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LuxuryGoodsNFT
 * @dev NFT contract for authenticating and tracking luxury goods
 * Each NFT represents a verified luxury item with immutable provenance
 */
contract LuxuryGoodsNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    // Struct to store luxury item details
    struct LuxuryItem {
        string brand;
        string model;
        string serialNumber;
        string chipId; // NFC/QR chip identifier
        address verifier; // Address of the authentication partner
        uint256 verificationDate;
        bool isAuthenticated;
    }

    // Struct to store transfer history
    struct TransferRecord {
        address from;
        address to;
        uint256 timestamp;
        uint256 price; // Price in wei (0 if not a sale)
    }

    // Mapping from token ID to luxury item details
    mapping(uint256 => LuxuryItem) public luxuryItems;
    
    // Mapping from token ID to transfer history
    mapping(uint256 => TransferRecord[]) private transferHistory;
    
    // Mapping from chip ID to token ID (to prevent duplicate minting)
    mapping(string => uint256) public chipIdToTokenId;
    
    // Mapping to track authorized verifiers
    mapping(address => bool) public authorizedVerifiers;
    
    // Events
    event ItemAuthenticated(
        uint256 indexed tokenId,
        string chipId,
        address indexed verifier,
        address indexed owner
    );
    
    event ItemTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );
    
    event ItemTransferredWithPrice(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 timestamp,
        uint256 price
    );
    
    event VerifierAuthorized(address indexed verifier, bool status);

    constructor() ERC721("LuxuryGoodsPassport", "LGP") Ownable(msg.sender) {
        // Contract deployer is the initial owner
    }

    /**
     * @dev Authorize or revoke a verifier
     * @param verifier Address of the verifier
     * @param status Authorization status
     */
    function setVerifierAuthorization(address verifier, bool status) external onlyOwner {
        authorizedVerifiers[verifier] = status;
        emit VerifierAuthorized(verifier, status);
    }

    /**
     * @dev Mint a new NFT for an authenticated luxury item
     * @param itemOwner Address of the item owner
     * @param brand Brand name of the luxury item
     * @param model Model or product name
     * @param serialNumber Serial number of the item
     * @param chipId Unique chip identifier (NFC/QR)
     * @param uri Metadata URI (can be IPFS or centralized storage)
     * @return tokenId The ID of the newly minted token
     */
    function mintAuthenticatedItem(
        address itemOwner,
        string memory brand,
        string memory model,
        string memory serialNumber,
        string memory chipId,
        string memory uri
    ) external returns (uint256) {
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), 
            "Not authorized to mint");
        require(bytes(chipId).length > 0, "Chip ID cannot be empty");
        require(chipIdToTokenId[chipId] == 0, "Item already authenticated");
        require(itemOwner != address(0), "Invalid owner address");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        // Mint the NFT
        _safeMint(itemOwner, newTokenId);
        _setTokenURI(newTokenId, uri);

        // Store luxury item details
        luxuryItems[newTokenId] = LuxuryItem({
            brand: brand,
            model: model,
            serialNumber: serialNumber,
            chipId: chipId,
            verifier: msg.sender,
            verificationDate: block.timestamp,
            isAuthenticated: true
        });

        // Map chip ID to token ID
        chipIdToTokenId[chipId] = newTokenId;

        // Record initial "transfer" to first owner with timestamp
        transferHistory[newTokenId].push(TransferRecord({
            from: address(0),
            to: itemOwner,
            timestamp: block.timestamp,
            price: 0
        }));

        emit ItemAuthenticated(newTokenId, chipId, msg.sender, itemOwner);

        return newTokenId;
    }

    /**
     * @dev Get details of a luxury item by token ID
     * @param tokenId The token ID
     * @return item The luxury item details
     */
    function getItemDetails(uint256 tokenId) external view returns (LuxuryItem memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return luxuryItems[tokenId];
    }

    /**
     * @dev Get token ID by chip ID
     * @param chipId The chip identifier
     * @return tokenId The associated token ID (0 if not found)
     */
    function getTokenIdByChipId(string memory chipId) external view returns (uint256) {
        return chipIdToTokenId[chipId];
    }

    /**
     * @dev Verify if an item is authenticated
     * @param chipId The chip identifier
     * @return isValid Whether the item is authenticated
     * @return tokenId The token ID if authenticated
     * @return owner The current owner address
     */
    function verifyItemByChipId(string memory chipId) 
        external 
        view 
        returns (bool isValid, uint256 tokenId, address owner) 
    {
        tokenId = chipIdToTokenId[chipId];
        if (tokenId == 0) {
            return (false, 0, address(0));
        }
        
        owner = ownerOf(tokenId);
        LuxuryItem memory item = luxuryItems[tokenId];
        isValid = item.isAuthenticated;
        
        return (isValid, tokenId, owner);
    }

    /**
     * @dev Get the total number of authenticated items
     * @return count Total number of minted tokens
     */
    function getTotalAuthenticatedItems() external view returns (uint256) {
        return _tokenIds;
    }

    /**
     * @dev Transfer item with price recording
     * @param from Current owner address
     * @param to New owner address
     * @param tokenId Token ID to transfer
     * @param price Sale price in wei (0 if gift/no sale)
     */
    function transferWithPrice(
        address from,
        address to,
        uint256 tokenId,
        uint256 price
    ) external {
        require(ownerOf(tokenId) == from, "From address is not the owner");
        require(msg.sender == from || getApproved(tokenId) == msg.sender || isApprovedForAll(from, msg.sender),
            "Caller is not owner nor approved");
        require(to != address(0), "Invalid recipient address");

        // Record the transfer with price
        transferHistory[tokenId].push(TransferRecord({
            from: from,
            to: to,
            timestamp: block.timestamp,
            price: price
        }));

        // Perform the transfer
        _transfer(from, to, tokenId);

        emit ItemTransferredWithPrice(tokenId, from, to, block.timestamp, price);
    }

    /**
     * @dev Get transfer history for a token
     * @param tokenId The token ID
     * @return history Array of transfer records
     */
    function getTransferHistory(uint256 tokenId) external view returns (TransferRecord[] memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return transferHistory[tokenId];
    }

    /**
     * @dev Get the acquisition timestamp for current owner
     * @param tokenId The token ID
     * @return timestamp When current owner acquired the item
     */
    function getCurrentOwnerAcquisitionTime(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        TransferRecord[] memory history = transferHistory[tokenId];
        if (history.length == 0) {
            return 0;
        }
        return history[history.length - 1].timestamp;
    }

    /**
     * @dev Override transfer function to emit custom event
     */
    function _update(address to, uint256 tokenId, address auth) 
        internal 
        override 
        returns (address) 
    {
        address from = _ownerOf(tokenId);
        address previousOwner = super._update(to, tokenId, auth);
        
        if (from != address(0) && to != address(0)) {
            emit ItemTransferred(tokenId, from, to, block.timestamp);
        }
        
        return previousOwner;
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

