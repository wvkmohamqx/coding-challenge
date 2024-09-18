<script lang="ts">
  import { onMount } from "svelte";
  

  interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
  }

  let users: User[] = [];
  let newUser: User = { id: 0, first_name: '', last_name: '', email: '', avatar: '' };
  let userToEdit: User = { id: 0, first_name: '', last_name: '', email: '', avatar: '' };
  let editMode = false;
  let showModal = false;

  const apiUrl = 'http://localhost:3000/users';

  async function fetchUsers() {
    const response = await fetch(apiUrl);
    users = await response.json();
  }

  async function createUser() {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    const user = await response.json();
    users = [...users, user];
    resetForm();
  }

  async function updateUser() {
    const response = await fetch(`${apiUrl}/${userToEdit.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userToEdit),
    });
    const updatedUser = await response.json();
    users = users.map(user => (user.id === updatedUser.id ? updatedUser : user));
    resetForm();
  }


  async function deleteUser(id: number) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    users = users.filter(user => user.id !== id);
  }

  function enterEditMode(user: User) {
    userToEdit = { ...user };
    editMode = true;
    showModal = true;
  }

  function resetForm() {
    newUser = { id: 0, first_name: '', last_name: '', email: '', avatar: '' };
    userToEdit = { id: 0, first_name: '', last_name: '', email: '', avatar: '' };
    editMode = false;
    showModal = false;
  }

  
  function showCreateForm() {
    resetForm();
    showModal = true;
  }

  onMount(fetchUsers);
</script>

<div class = "user-container">
<div class="user-list-header">
    <button class="create-button" on:click={showCreateForm}>Create New User</button>
  </div>
  
<div class="user-list-container"> 
<div class="user-list">
    <h2> USER LIST </h2>
  </div>
  <table>
    <thead>
      <tr>
        <th>Avatar</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email Address</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each users as user}
        <tr>
          <td><img class="avatar" src={user.avatar} alt={user.first_name} /></td>
          <td>{user.first_name}</td>
          <td>{user.last_name}</td>
          <td>{user.email}</td>
          <td class="action-buttons">
            <button class="edit" on:click={() => enterEditMode(user)}>Edit</button>
            <button class="delete" on:click={() => deleteUser(user.id)}>Delete</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
</div>


{#if showModal}
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h2>{editMode ? 'EDIT USER' : 'CREATE NEW USER'}</h2>
    </div>
    <form on:submit|preventDefault={editMode ? updateUser : createUser}>
      
      {#if editMode}
        
		<label for="first_name">FIRST NAME</label>
        <input id="first_name" type="text" bind:value={userToEdit.first_name} required />

        <label for="last_name">LAST NAME</label>
        <input id="last_name" type="text" bind:value={userToEdit.last_name} required />

        <label for="email">EMAIL ADDRESS</label>
        <input id="email" type="email" bind:value={userToEdit.email} required />

        <label for="avatar">AVATAR IMAGE LINK</label>
        <input id="avatar" type="text" bind:value={userToEdit.avatar} required />
      {:else}
        
		<label for="first_name">FIRST NAME</label>
        <input id="first_name" type="text" bind:value={newUser.first_name} required />

        <label for="last_name">LAST NAME</label>
        <input id="last_name" type="text" bind:value={newUser.last_name} required />

        <label for="email">EMAIL ADDRESS</label>
        <input id="email" type="email" bind:value={newUser.email} required />

        <label for="avatar">AVATAR IMAGE LINK</label>
        <input id="avatar" type="text" bind:value={newUser.avatar} required />
      {/if}

      <div class="button-group">
        <button type="button" class="cancel-btn" on:click={resetForm}>Cancel</button>
		<button type="submit" class="create-btn">{editMode ? 'Save' : 'Create'}</button>
      </div>
    </form>
  </div>
</div>
{/if}
<style>
:root {
  --primary-color: #DD013F;
  --secondary-color: #081430;
  --white-color: #FFFFFF;
  --background-color: #F9F9F9;
  --text-color: #FFFFFF;
  --border-color: #DD013F;
}

.user-list-container {
  border: 2px solid var(--border-color);
  background-color: var(--background-color);
}

.user-list-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.user-container {
  width: 70%;
  margin: 0 auto;
}

.create-button {
  background-color: #DD013F;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
  margin-left: 10px;
}

.user-list {
  background-color: #DD013F;
  width: 100%;
  margin-top: -20px;
}

.user-list h2 {
  color: white; /* White text */
  font-size: 24px;
  font-weight: 600;
  text-transform: uppercase;
  padding-left: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  color: black;
  text-transform: uppercase;
  text-align: left;
  font-weight: bold;
  
}

td {
  text-align: left;
  border-bottom: 1px solid #ddd;
  padding: 10px;
}

td.action-buttons {
  text-align: right;
}

.avatar {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

button.edit {
  background-color: var(--primary-color);
  color: var(--white-color);
}

button.delete {
  background-color: var(--primary-color);
  color: var(--white-color);
  margin-right: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: #F9F9F9;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 50%;
  margin: 0 auto;
}

.modal-header {
  background-color: #DD013F;
  padding: 15px;
}

.modal-header h2 {
  color: white;
  font-size: 24px;
  margin: 0;
}

label {
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 5px;
  display: block;
  color: black;
}

input {
  width: 95%;
  padding: 10px;
  margin-bottom: 15px;
  margin: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.create-btn,
.cancel-btn {
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 10px 20px;
  margin-right: 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.create-btn {
  background-color: #DD013F;
  color: white;
  border: 2px solid #DD013F;
}

.cancel-btn {
  background-color: white;
  color: #DD013F;
  border: 2px solid #DD013F;
}

.create-btn:hover,
.cancel-btn:hover {
  opacity: 0.9;
}



@media (min-width: 1200px) {
  .modal {
    width: 40%;
  }

  .user-container {
    width: 60%;
  }
}


@media (min-width: 768px) and (max-width: 1199px) {
  .modal {
    width: 60%;
  }

  .user-container {
    width: 80%;
  }

  .create-button {
    font-size: 12px;
  }
}


@media (max-width: 767px) {
  .modal {
    width: 90%;
  }

  .user-container {
    width: 100%;
  }

  .create-button {
    font-size: 10px;
  }

  input {
    width: 100%;
    margin: 5px;
    padding: 8px;
  }

  .create-btn,
  .cancel-btn {
    width: 100%;
    font-size: 14px;
  }

  .button-group {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
