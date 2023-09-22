// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract AccessControl {
    /**
     * @dev Emitted when `msg.sender` is not authorized to operate the contract.
     */
    error Unauthorized(address operator);

    /**
     * @dev Emitted when `authorizationId` (role) is invalid.
     */
    error InvalidAuthId(uint256 authId);

    /**
     * @dev Emitted when a new address is added to an `authorizationId` (role).
     */
    event AuthorizePersonnel(
        uint256 indexed authorizationId,
        address indexed addr,
        bool authorized
    );

    /**
     * @dev Emitted when an `authorizationId` (role) is added as an operator of
     * a function in the contract.
     */
    event AuthorizeOperator(
        uint256 indexed authorizationId,
        bytes4 indexed interfaceId
    );

    /// @dev The owner of the contract.
    address private _owner;

    /// @dev Mapping of `authorizationId` and `address` to boolean.
    mapping(uint256 => mapping(address => bool)) private _auths;

    /// @dev Mapping of `interfaceId` and `authorizationId` to boolean.
    mapping(bytes4 => mapping(uint256 => bool)) private _funcAuths;

    /**
     * @dev Modifier to check if `msg.sender` is authorized to operate a
     * given interfaceId from one of the contract's function.
     */
    modifier onlyOperator(
        bytes4 _interfaceId,
        uint256 _authorizationId,
        address _operator
    ) {
        if (
            !hasAuthorization(_authorizationId, _operator) ||
            !isOperator(_interfaceId, _authorizationId)
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
     * @dev This function sets an authorization to an address.
     *
     * Emits a {AuthorizePersonnel} event.
     *
     * Requirements:
     *
     * - `msg.sender` must be the owner of the contract.
     * - `_authorizationId` must not be 0.
     */
    function setAuthorization(
        uint256 _authorizationId,
        address _authorizedAddress,
        bool _isAuthorized
    ) public virtual onlyOwner {
        if (_authorizationId == 0) {
            revert InvalidAuthId(_authorizationId);
        }

        _auths[_authorizationId][_authorizedAddress] = _isAuthorized;

        emit AuthorizePersonnel(
            _authorizationId,
            _authorizedAddress,
            _isAuthorized
        );
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
     * - `_authorizationId` must not be 0.
     */
    function setOperator(
        bytes4 _interfaceId,
        uint256 _authorizationId,
        bool _isAuthorized
    ) public virtual onlyOwner {
        if (_authorizationId == 0) {
            revert InvalidAuthId(_authorizationId);
        }

        _funcAuths[_interfaceId][_authorizationId] = _isAuthorized;

        emit AuthorizeOperator(_authorizationId, _interfaceId);
    }

    /**
     * @dev This function checks if an address holds a given `authorizationId`.
     *
     * NOTE: The owner of the contract is always authorized.
     */
    function hasAuthorization(
        uint256 _authorizationId,
        address _address
    ) public view virtual returns (bool) {
        if (owner() == msg.sender) {
            return true;
        }
        return _auths[_authorizationId][_address];
    }

    /**
     * @dev This function checks if an `authorizedId` is allowed to operate
     * a given `_interfaceId`.
     *
     * NOTE: The owner of the contract is always authorized.
     */
    function isOperator(
        bytes4 _interfaceId,
        uint256 _authorizationId
    ) public view virtual returns (bool) {
        if (owner() == msg.sender) {
            return true;
        }
        return _funcAuths[_interfaceId][_authorizationId];
    }
}
