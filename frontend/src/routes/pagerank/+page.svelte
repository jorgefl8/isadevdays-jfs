<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import {
        Button,
        Table,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        Alert, Col, Row
    } from "sveltestrap";

    let open = false;
    const toggle = () => (open = !open);

    onMount(async () => {
        getUsers();
    });

    let API = "/api/v1/pagerank";

    if (dev) API = "http://localhost:12345" + API;

    let users = [];
    let newUser = {
        username: "alesancor1",
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
            },
            body: JSON.stringify({
                province: newUser.province,
                year: parseInt(newUser.year),
                pib_current_price: newUser.pib_current_price,
                pib_percentage_structure: newUser.pib_percentage_structure,
                pib_variation_rate: newUser.pib_variation_rate,
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 201) {
            message = "Recurso creado correctamente";
            color_alert = "success";
            getMks();
        }else{
            if (status == 400) {
                message = "Hay que insertar datos o faltan campos";
                color_alert = "danger";
            }else{
                if(status == 409){
                    message = "El recurso ya existe o la provincia tiene que ser de Andalucía";
                    color_alert = "danger";
                }
            }
        }
    }
    async function deleteMks() {
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
    async function deleteMks_one(province, year) {
        resultStatus = result = "";
        const res = await fetch(API + "/" + province + "/" + year, {
            method: "DELETE",
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = "Recurso borrado correctamente";
            color_alert = "success";
            getMks();
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
                        <Button color="primary" on:click={deleteMks}>Proceder</Button>
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
            <th>Provincia</th>
            <th>Año</th>
            <th>PIB Precios corrientes</th>
            <th>PIB Estructura porcentual</th>
            <th>PIB Tasas de variación</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value={newUser.province} /></td>
            <td><input bind:value={newUser.year} /></td>
            <td><input bind:value={newUser.pib_current_price} /></td>
            <td><input bind:value={newUser.pib_percentage_structure} /></td>
            <td><input bind:value={newUser.pib_variation_rate} /></td>
            <td
                ><Button color="primary" on:click={createMks}
                    >Crear recurso</Button
                ></td
            >
        </tr>

        {#each mks as x}
            <tr>
                <td
                    ><a
                        class="perso"
                        href="/market-prices-stats/{x.province}/{x.year}"
                        >{x.province}</a
                    ></td
                >
                <td>{x.year}</td>
                <td>{x.pib_current_price}</td>
                <td>{x.pib_percentage_structure}</td>
                <td>{x.pib_variation_rate}</td>
                <td
                    ><Button
                        color="danger"
                        on:click={deleteMks_one(x.province, x.year)}
                        >Borrar</Button
                    ></td
                >
                <td
                    ><Button on:click
                        ><a href="/market-prices-stats/{x.province}/{x.year}"
                            >Editar</a
                        ></Button
                    ></td
                >
                <td>&nbsp</td>
            </tr>
        {/each}
    </tbody>
</Table>

<style>
    a {
        text-decoration: none;
        color: white;
    }
    .perso {
        color: #1e90ff;
    }
    .perso:hover {
        color: rgb(21, 41, 124);
        text-decoration: underline;
    }
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
