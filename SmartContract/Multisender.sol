// SPDX-License-Identifier: MIT

pragma solidity = 0.8.7;

library Strings {
    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";
    uint8 private constant _ADDRESS_LENGTH = 20;

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function toHexString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0x00";
        }
        uint256 temp = value;
        uint256 length = 0;
        while (temp != 0) {
            length++;
            temp >>= 8;
        }
        return toHexString(value, length);
    }

    function toHexString(uint256 value, uint256 length)
        internal
        pure
        returns (string memory)
    {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _HEX_SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }

    function toHexString(address addr) internal pure returns (string memory) {
        return toHexString(uint256(uint160(addr)), _ADDRESS_LENGTH);
    }
}

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
     function balanceOf(address account) external view returns (uint256);
}

contract Ownable {
    address private _owner;

    constructor() {
        _owner = msg.sender;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(isOwner(), "Function accessible only by the owner !!");
        _;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == _owner;
    }
}

contract crypto_multisend is Ownable {

    function batch_transfer_Erc20(
        address _tokenadress,
        address[] memory _reciver,
        uint256[] memory amount
    ) public payable returns (bool) {
        uint256 tamount = AmountCalc(amount);
        IERC20 token = IERC20(address(_tokenadress));
        token.transferFrom(msg.sender, address(this), tamount);
        for (uint256 i = 0; i < _reciver.length; i++) {
            token.transfer(_reciver[i], amount[i]);
        }
        return true;
    }

    function batch_transfer_Native (address [] memory _reciver, uint256[] memory amount) public payable returns (bool) {
        require (_reciver.length == amount.length, "not correct ammount");
        require (msg.value == AmountCalc(amount), "insuffice amount send");
         for(uint i = 0; i < _reciver.length; i++) {
            payable(_reciver[i]).transfer(amount[i]);
        }
        return true;
    }

    function AmountCalc(uint256[] memory n) internal pure returns (uint256) {
        uint256 t = 0;
        for (uint256 i = 0; i < n.length; i++) {
            t = t + n[i];
        }
        return t;
    }

    function Calc(uint256[] memory amount) public pure returns (uint256) {
        return AmountCalc(amount);
    }

     function withdrawNative(address payable receiver, uint256 amount)
        public
        payable onlyOwner
    {
        uint256 balance = address(this).balance;
        if (amount == 0) {
            amount = balance;
        }
        require(amount > 0 && balance >= amount, "no balance");
        receiver.transfer(amount);
    }

    function WithdrawToken(
        address receiver,
        address tokenAddress,
        uint256 amount
    ) public payable onlyOwner {
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        if (amount == 0) {
            amount = balance;
        }
        require(amount > 0 && balance >= amount, "bad amount");
        IERC20(tokenAddress).transfer(receiver, amount);
    }
}
