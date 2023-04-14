<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import {Button,Table,Modal,ModalBody,ModalFooter,ModalHeader,Alert, Col, Row} from "sveltestrap";

    let open = false;
    const toggle = () => (open = !open);

    onMount(async () => {
        getUsers();
    });

    let API = "/api/v1/pagerank";

    if (dev) API = "http://localhost:12345" + API;

    let users = [];
    let newUser = {
        username: "rafnixg",
        depth: 3,
        damping_factor: 0.85
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
            message = "Ha habido un error en la petición";
            color_alert = "danger";
        }
    }

    async function createUser() {
        resultStatus = result = "";
        const res = await fetch(API+"/"+newUser.username+"?depth="+newUser.depth+"&damping="+newUser.damping_factor, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 201) {
            message = "Recurso creado correctamente";
            color_alert = "success";
            getUsers();
        }else{
            if (status == 400) {
                message = "Hay que insertar datos o faltan campos";
                color_alert = "danger";
            }
        }
    }
    async function delete_all() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "DELETE",
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = "Recursos borrados correctamente";
            color_alert = "success";
            open = false;
            getUsers();
        }
    }
    async function delete_one(user) {
        resultStatus = result = "";
        const res = await fetch(API + "/" + user, {
            method: "DELETE",
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = "Recurso borrado correctamente";
            color_alert = "success";
            getUsers();
        }
    }
</script>
    <div class="cabecera">
    <Row >
        <Col xs="7">
            <h2>
                GitHub PageRank Users 
                <Button color="danger" on:click={toggle}>Borrar recursos</Button>
                <Modal isOpen={open} {toggle}>
                    <ModalHeader {toggle}>Vas a borrar todos los recursos de la base de datos</ModalHeader>
                    <ModalBody>¿Estás seguro?</ModalBody>
                    <ModalFooter>
                        <Button color="primary" on:click={delete_all}>Proceder</Button>
                        <Button color="secondary" on:click={toggle}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </h2>
        </Col>
        <Col xs="4"> 
            {#if message != ""}
            <Alert fade={true} color={color_alert} dismissible>{message}</Alert>
        {/if}
        </Col>
    </Row>
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
            <td></td>
            <td></td>
            <td><Button color="primary" on:click={createUser}>Crear recurso</Button></td>
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
                <td><Button color="danger" on:click={delete_one(x.params.username)}>Borrar</Button></td>                
                <td>&nbsp</td>
            </tr>
        {/each}
    </tbody>
</Table>

<style>
    h2 {
        margin-left: 2%;
        margin-top: 0.5%;
    }
    .cabecera {
        margin-top: 1%;
        margin-left: 1.5%;
        margin-bottom: 1%;
    }
    
</style>
