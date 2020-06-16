const users = [];

const addUser = ({ id, name, room }) => {
  const newName = name.trim().toLowerCase();
  const newRoom = room.trim().toLowerCase();

  const userIsAlreadyInTheRoom = users.find(
    (user) => user.room === newRoom && users.name === newName
  );

  if (userIsAlreadyInTheRoom) {
    return { error: "Username is taken" };
  }

  const user = {
    id,
    name: newName,
    room: newRoom,
  };

  users.push(user);

  return user;
};

const removeUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    return users.splice(userIndex, 1)[0];
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUserInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
};
