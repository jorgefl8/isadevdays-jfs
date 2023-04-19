<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import {Button,Table,Modal,ModalBody,ModalFooter,ModalHeader,Alert,Col,Row,} from "sveltestrap";
  
    let open = false;
    const toggle = () => (open = !open);
  
    onMount(async () => {
      getUsers();
    });
  
    let API = '/api/v1/pagerank';
    var port = process.env.PORT ?? 12345; 
  
    if (dev) API = 'http://localhost:' + port + API;
  
    let users = [];
    let newUser = {
      username: "",
      depth: 3,
      damping_factor: 0.85,
    };
    let message = "";
    let color_alert;
    let result = "";
    let resultStatus = "";
  
    async function getUsers() {
      resultStatus = result = "";
      const res = await fetch(API, {
        method: "GET",
      });
      try {
        const data = await res.json();
        result = JSON.stringify(data, null, 2);
        users = data;
      } catch (error) {
        console.log(`Error parsing result: ${error}`);
      }
      const status = await res.status;
      resultStatus = status;
      if (status == 400) {
        message = "Error in request";
        color_alert = "danger";
      }
      setTimeout(() => {
        message = "";
        color_alert = "";
      }, 3200);
    }
  
    async function createUser() {
      resultStatus = result = "";
      const res = await fetch(
        API +
          "/" +
          newUser.username +
          "?depth=" +
          newUser.depth +
          "&damping=" +
          newUser.damping_factor,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const status = await res.status;
      resultStatus = status;
      if (status == 201) {
        message = "Resource created successfully";
        color_alert = "success";
        getUsers();
      } 
      if (status == 400) {
          message = "Error in request";
          color_alert = "danger";
      }
      if (status == 409) {
          message = "Resource already exists";
          color_alert = "warning";
      }
      setTimeout(() => {
        message = "";
        color_alert = "";
      }, 3200);
    }
    async function delete_all() {
      resultStatus = result = "";
      const res = await fetch(API, {
        method: "DELETE",
      });
      const status = await res.status;
      resultStatus = status;
      if (status == 200) {
        message = "Resources deleted successfully";
        color_alert = "success";
        open = false;
        getUsers();
      }
      setTimeout(() => {
        message = "";
        color_alert = "";
      }, 3200);
    }
    async function delete_one(user) {
      resultStatus = result = "";
      const res = await fetch(API + "/" + user, {
        method: "DELETE",
      });
      const status = await res.status;
      resultStatus = status;
      if (status == 200) {
        message = "Resource deleted successfully";
        color_alert = "success";
        getUsers();
      }
      setTimeout(() => {
        message = "";
        color_alert = "";
      }, 3200);
    }
  </script>
<main>
  <div class="container" style="margin-top: 1%;">
    <div class="row, cabecera">
      <div class="col-md-6">
          <h2>
            GitHub PageRank Users
            <Button color="danger" on:click={toggle}>Delete resources</Button>
            <Modal isOpen={open} {toggle}>
              <ModalHeader {toggle}>You are going to delete all db resources</ModalHeader>
              <ModalBody>¿Are you sure?</ModalBody>
              <ModalFooter>
                <Button color="primary" on:click={delete_all}>Proceed</Button>
                <Button color="secondary" on:click={toggle}>Cancel</Button>
              </ModalFooter>
            </Modal>
          </h2>
      </div>
      <div class="col-md-6">
        {#if message != ""}
            <Alert fade={true} color={color_alert} >{message}</Alert>
          {/if}
      </div>
    </div>
    <Table bordered striped>
      <thead>
        <tr>
          <th>Username</th>
          <th>Depth</th>
          <th>Damping_factor</th>
          <th>Status</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input bind:value={newUser.username} /></td>
          <td><input bind:value={newUser.depth} /></td>
          <td><input bind:value={newUser.damping_factor} /></td>
          <td />
          <td />
          <td><Button color="primary" on:click={createUser}>Create</Button></td>
        </tr>
        {#each users as x}
          <tr>
            <td>{x.params.username}</td>
            <td>{x.params.depth}</td>
            <td>{x.params.damping_factor}</td>
            <td>{x.status}</td>
            <td>
              <Table striped>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {#each x.result as y}
                    <tr>
                      <td>{y.username}</td>
                      <td>{y.score}</td>
                    </tr>
                  {/each}
                </tbody>
              </Table>
            </td>
            <td><Button color="danger" on:click={delete_one(x.params.username)}>Delete</Button></td>
          </tr>
        {/each}
      </tbody>
    </Table>
  </div>
</main>
<style>
    h2 {
      margin-left: 2%;
      margin-top: 0.5%;
    }
    .cabecera {
      margin-top: 1%;
      margin-left: 1.5%;
      margin-bottom: 1%;
      display: flex;
    }
    th {
        background-color: #1e90ff;
        color: white;
        font-weight: bold;
    }
</style>