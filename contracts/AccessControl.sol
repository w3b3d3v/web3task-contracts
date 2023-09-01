// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

error Unauthorized();
error InvalidAuthId();

abstract contract AccessControl {
    event AuthorizedPersonnel(
        uint256 indexed id,
        address indexed addr,
        bool authorized
    );
    event AuthorizedOperator(uint256 indexed id, bytes4 indexed interfaceId);

    constructor() {
        _auths[1][msg.sender] = true;
    }

    mapping(uint256 => mapping(address => bool)) internal _auths;
    mapping(bytes4 => mapping(uint256 => bool)) internal _funcAuths;

    modifier onlyOperator(
        bytes4 _interfaceId,
        uint256 _authorizationId,
        address _address
    ) {
        if (
            !isOperator(_interfaceId, _authorizationId) ||
            !hasAuthorization(_authorizationId, _address)
        ) {
            revert Unauthorized();
        }
        _;
    }

    modifier onlyOwner() {
        if (!hasAuthorization(1, msg.sender)) {
            revert Unauthorized();
        }
        _;
    }

    function setAuthorization(
        uint256 _authorizationId,
        address _authorizedAddress,
        bool _isAuthorized
    ) public onlyOwner {
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
    ) public onlyOwner {
        _funcAuths[_interfaceId][_authorizationId] = _isAuthorized;
        emit AuthorizedOperator(_authorizationId, _interfaceId);
    }

    function hasAuthorization(
        uint256 _authorizationId,
        address _address
    ) public view returns (bool) {
        return _auths[_authorizationId][_address];
    }

    function isOperator(
        bytes4 _interfaceId,
        uint256 _authorizationId
    ) public view returns (bool) {
        return _funcAuths[_interfaceId][_authorizationId];
    }
}
