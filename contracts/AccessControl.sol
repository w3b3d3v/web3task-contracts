// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract AccessControl {
    /**
     * @dev Emitted when `msg.sender` is not authorized to operate the contract.
     */
    error Unauthorized(address operator);

    /**
     * @dev Emitted when `roleId` is invalid.
     */
    error InvalidRoleId(uint256 roleId);

    /**
     * @dev Emitted when a new address is added to an `roleId`.
     */
    event AuthorizePersonnel(
        uint256 indexed roleId,
        address indexed authorizedAddress,
        bool isAuthorized
    );

    /**
     * @dev Emitted when an `roleId` is added as an operator of
     * a function in the contract.
     */
    event AuthorizeOperator(
        bytes4 indexed interfaceId,
        uint256 indexed roleId,
        bool isAuthorized
    );

    /// @dev The owner of the contract.
    address private _owner;

    /// @dev Mapping of `roleId` and `address` to boolean.
    mapping(uint256 => mapping(address => bool)) private _roles;

    /// @dev Mapping of `interfaceId` and `roleId` to boolean.
    mapping(bytes4 => mapping(uint256 => bool)) private _operators;

    /**
     * @dev Modifier to check if `msg.sender` is authorized to operate a
     * given interfaceId from one of the contract's function.
     */
    modifier onlyOperator(
        bytes4 _interfaceId,
        uint256 _roleId,
        address _operator
    ) {
        if (
            !hasRole(_roleId, _operator) || !isOperator(_interfaceId, _roleId)
        ) {
            revert Unauthorized(_operator);
        }
        _;
    }

    /**
     * @dev Modifier to check if `msg.sender` is the owner of the contract.
     */
    modifier onlyOwner() {
        if (_owner != msg.sender) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _owner = msg.sender;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev This function sets an role to an address.
     *
     * Emits a {AuthorizePersonnel} event.
     *
     * Requirements:
     *
     * - `msg.sender` must be the owner of the contract.
     * - `_roleId` must not be 0.
     */
    function setRole(
        uint256 _roleId,
        address _authorizedAddress,
        bool _isAuthorized
    ) public virtual onlyOwner {
        if (_roleId == 0) {
            revert InvalidRoleId(_roleId);
        }

        _roles[_roleId][_authorizedAddress] = _isAuthorized;

        emit AuthorizePersonnel(_roleId, _authorizedAddress, _isAuthorized);
    }

    /**
     * @dev This function sets an authorized role as the operator of a
     * given interface id.
     *
     * Emits a {AuthorizeOperator} event.
     *
     * Requirements:
     *
     * - `msg.sender` must be the owner of the contract.
     * - `_roleId` must not be 0.
     */
    function setOperator(
        bytes4 _interfaceId,
        uint256 _roleId,
        bool _isAuthorized
    ) public virtual onlyOwner {
        if (_roleId == 0) {
            revert InvalidRoleId(_roleId);
        }

        _operators[_interfaceId][_roleId] = _isAuthorized;

        emit AuthorizeOperator(_interfaceId, _roleId, _isAuthorized);
    }

    /**
     * @dev This function checks if an address holds a given `roleId`.
     *
     * NOTE: The owner of the contract is always authorized.
     */
    function hasRole(
        uint256 _roleId,
        address _address
    ) public view virtual returns (bool) {
        if (owner() == msg.sender) {
            return true;
        }
        return _roles[_roleId][_address];
    }

    /**
     * @dev This function checks if an `authorizedId` is allowed to operate
     * a given `_interfaceId`.
     *
     * NOTE: The owner of the contract is always authorized.
     */
    function isOperator(
        bytes4 _interfaceId,
        uint256 _roleId
    ) public view virtual returns (bool) {
        if (owner() == msg.sender) {
            return true;
        }
        return _operators[_interfaceId][_roleId];
    }
}
