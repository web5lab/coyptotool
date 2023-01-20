// SPDX-License-Identifier: MIT

pragma solidity = 0.8.7;

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

contract cryptotool_multisender {
    function batch_transfer(
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
        payable
    {
        uint256 balance = address(this).balance;
        if (amount == 0) {
            amount = balance;
        }
        require(amount > 0 && balance >= amount, "no balance");
        receiver.transfer(amount);
    }

    function withdrawToken(
        address receiver,
        address tokenAddress,
        uint256 amount
    ) public payable  {
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        if (amount == 0) {
            amount = balance;
        }
        require(amount > 0 && balance >= amount, "bad amount");
        IERC20(tokenAddress).transfer(receiver, amount);
    }
}
