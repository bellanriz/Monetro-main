// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MonetroToken
 * @dev ERC-20 reward token for the Monetro family finance app.
 * Kids earn tokens for good financial habits (saving, staying under budget).
 * Only the contract owner (backend server) can mint new tokens.
 */
contract MonetroToken is ERC20, Ownable {
    // Events for tracking rewards
    event RewardMinted(address indexed to, uint256 amount, string reason);

    constructor() ERC20("Monetro Coin", "MNTR") Ownable(msg.sender) {
        // Mint initial supply to the deployer (for testing)
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    /**
     * @dev Mint reward tokens to a user. Only callable by the owner (backend).
     * @param to The wallet address of the kid receiving the reward
     * @param amount The number of tokens to mint (in wei, so multiply by 10^18)
     * @param reason Description of why the reward was given
     */
    function mintReward(address to, uint256 amount, string calldata reason) external onlyOwner {
        _mint(to, amount);
        emit RewardMinted(to, amount, reason);
    }

    /**
     * @dev Batch mint rewards to multiple users at once.
     * @param recipients Array of wallet addresses
     * @param amounts Array of token amounts
     * @param reasons Array of reward reasons
     */
    function batchMintRewards(
        address[] calldata recipients,
        uint256[] calldata amounts,
        string[] calldata reasons
    ) external onlyOwner {
        require(
            recipients.length == amounts.length && amounts.length == reasons.length,
            "Arrays must be same length"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
            emit RewardMinted(recipients[i], amounts[i], reasons[i]);
        }
    }
}
