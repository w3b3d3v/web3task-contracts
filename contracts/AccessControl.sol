// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract AccessControl {
    /**
     * @dev Emitted when `msg.sender` is not authorized to operate the contract.
     */
    error Unauthorized(address operator);

    error InvalidAuthId();

    event AuthorizedPersonnel(
        uint256 indexed id,
        address indexed addr,
        bool authorized
    );
    event AuthorizedOperator(uint256 indexed id, bytes4 indexed interfaceId);

    mapping(uint256 => mapping(address => bool)) private _auths;
    mapping(bytes4 => mapping(uint256 => bool)) private _funcAuths;

    constructor() {
        _auths[1][msg.sender] = true;
    }

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

    modifier onlyOwner() {
        if (!hasAuthorization(1, msg.sender)) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    function setAuthorization(
        uint256 _authorizationId,
        address _authorizedAddress,
        bool _isAuthorized
    ) public virtual onlyOwner {
        if (_authorizationId == 0 || _authorizationId == 1) {
            revert InvalidAuthId();
        }
        _auths[_authorizationId][_authorizedAddress] = _isAuthorized;
        emit AuthorizedPersonnel(
            _authorizationId,
            _authorizedAddress,
            _isAuthorized
        );
    }

    function setOperator(
        bytes4 _interfaceId,
        uint256 _authorizationId,
        bool _isAuthorized
    ) public virtual onlyOwner {
        _funcAuths[_interfaceId][_authorizationId] = _isAuthorized;
        emit AuthorizedOperator(_authorizationId, _interfaceId);
    }

    function hasAuthorization(
        uint256 _authorizationId,
        address _address
    ) public view virtual returns (bool) {
        return _auths[_authorizationId][_address];
    }

    function isOperator(
        bytes4 _interfaceId,
        uint256 _authorizationId
    ) public view virtual returns (bool) {
        return _funcAuths[_interfaceId][_authorizationId];
    }
}
