import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [isSplitFormOpen, setIsSplitFormOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleToggle() {
    setIsSplitFormOpen((show) => !show);
  }
  function handleAddFriend(friend) {
    setFriends((prev) => [...prev, friend]);
    setIsSplitFormOpen(false);
  }
  function handleSelection(friend) {
    setSelectedFriend((selected) =>
      selected?.id === friend.id ? null : friend
    );
    setIsSplitFormOpen(false);
  }
  function handleSplitBill(value) {
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="App">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelect={handleSelection}
        />
        {isSplitFormOpen && (
          <AddFriendForm
            isOpen={isSplitFormOpen}
            onAddFriend={handleAddFriend}
          />
        )}
        <Button onClick={handleToggle}>
          {isSplitFormOpen ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <SplitForm onSplit={handleSplitBill} selectedFriend={selectedFriend} />
      )}
    </div>
  );
}
export default App;
function FriendsList({ friends, selectedFriend, onSelect }) {
  return (
    <ul className="friend-list">
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, selectedFriend, onSelect }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li key={friend.id} className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <div>
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} ${Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes You ${friend.balance}
          </p>
        )}
        {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      </div>

      <Button onClick={() => onSelect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function SplitForm({ selectedFriend, onSplit }) {
  const [bill, setBill] = useState("");
  const [expense, setExpense] = useState("");
  const [whoPay, setWhoPay] = useState("user");
  const expenseFriend = bill - expense;
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !expense) return;
    onSplit(whoPay === "user" ? expenseFriend : -expense);
    setBill("");
    setExpense("");
    setWhoPay("user");
  }
  return (
    <form className="split-bill-form" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>
      <label>Bill value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />
      <label>Your expense</label>
      <input
        type="number"
        value={expense}
        onChange={(e) =>
          setExpense(+e.target.value > bill ? expense : +e.target.value)
        }
      />
      <label>{selectedFriend.name}'s expense</label>
      <input type="number" disabled value={+expenseFriend} />
      <label>Who is paying the bill ?</label>
      <select value={whoPay} onChange={(e) => setWhoPay(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const randomNum = Math.round(Math.random() * 100);
  const [imgUrl, setImgUrl] = useState(`https://i.pravatar.cc/${randomNum}`);
  const id = crypto.randomUUID();
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !imgUrl) return;
    const newFriend = {
      name,
      image: `${imgUrl}?=${id}`,
      balance: 0,
      id,
    };
    onAddFriend(newFriend);
    setName("");
    setImgUrl(`https://i.pravatar.cc/${randomNum}`);
  }
  return (
    <form className="add-friend-form" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image URL</label>
      <input
        type="text"
        value={imgUrl}
        onChange={(e) => setImgUrl(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="btn">
      {children}
    </button>
  );
}
