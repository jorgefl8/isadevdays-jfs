<script>
    import {Icon,Nav,NavLink,} from "sveltestrap";
</script>

<div>
    <Nav>
        <h2>Github-PageRank</h2>
        <NavLink href="/"><h6>Inicio</h6> <Icon name="house-fill"/></NavLink>
        <NavLink href="/about"><h6>Acerca de</h6></NavLink>
    </Nav>
</div>

<style>
    div {
        background-color: #1e90ff;
        color: #ffffff;
        padding: 5px;   
    }
    h2 {
        font-size: 25px;
        font-weight: normal;
        margin-right: 1%;
        margin-left: 1%;
    }
    h6{
        color: white;
    }
</style>
