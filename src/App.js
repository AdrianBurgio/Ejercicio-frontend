import React, {useState , useEffect} from 'react';
import './App.css';
import MaterialTable from 'material-table';
import axios from 'axios';
import {Modal, TextField, Button} from '@material-ui/core';
import {makeStyles  } from '@material-ui/core/styles';


const columnas=[
  {title:'Nombre de usuario',field:'username',type:'string'},
  {title:'Email',field:'email',type:'string'},
  {title:'Teléfono',field:'telefono',type:'string'}
]

const baseUrl="https://localhost:44358/api/usuarios";

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function App() {

  const styles = useStyles();
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado]=useState({
    id:"",
    username: "",
    email: "",
    telefono: ""
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setUsuarioSeleccionado(prevState=>({
      ...prevState,
      [name]: value
    }));
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    await axios.post(baseUrl, usuarioSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }


  const peticionPut=async()=>{
    await axios.put(baseUrl+"/"+usuarioSeleccionado.id, usuarioSeleccionado)
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(usuario=>{
        if(usuario.id===usuarioSeleccionado.id){
          usuario.username=usuarioSeleccionado.username;
          usuario.email=usuarioSeleccionado.email;
          usuario.telefono=usuarioSeleccionado.telefono;
        }
      });
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+usuarioSeleccionado.id)
    .then(response=>{
      setData(data.filter(usuario=>usuario.id!==usuarioSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarUsuario=(usuario, caso)=>{
    setUsuarioSeleccionado(usuario);
    (caso==="Editar")?abrirCerrarModalEditar()
    :
    abrirCerrarModalEliminar()
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }
  
  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }


  useEffect(()=>{
    peticionGet();
  },[])


  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Nuevo Usuario</h3>
      <TextField className={styles.inputMaterial} label="Nombre de Usuario" name="username" onChange={handleChange}/>
      <br />
      <TextField className={styles.inputMaterial} label="Email" name="email" onChange={handleChange}/>          
      <br />
      <TextField className={styles.inputMaterial} label="Teléfono" name="telefono" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar Usuario</h3>
      <TextField className={styles.inputMaterial} label="Nombre de Usuario" name="username" onChange={handleChange} value={usuarioSeleccionado&&usuarioSeleccionado.username}/>
      <br />
      <TextField className={styles.inputMaterial} label="Email" name="email" onChange={handleChange} value={usuarioSeleccionado&&usuarioSeleccionado.email}/>          
      <br />
      <TextField className={styles.inputMaterial} label="Teléfono" name="telefono" onChange={handleChange} value={usuarioSeleccionado&&usuarioSeleccionado.telefono}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Actualizar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar al usuario <b>{usuarioSeleccionado && usuarioSeleccionado.username}</b>? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()}>Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>
      </div>
    </div>
  )


  return (
    <div className="App">

      <br />
      <Button variant="outlined" color="primary" onClick={()=>abrirCerrarModalInsertar()}> Agregar Usuario</Button>
     
      <br /><br />

      <MaterialTable

        columns={columnas} 
        data={data}
        title="Ejercicio Usuarios"
        actions={[
          {
            icon:'edit', 
            tooltip:'Editar usuario',
            iconProps: { color: 'default' },
            //onClick:(event,rowData) =>alert(''+rowData.username)
            onClick: (event, rowData) => seleccionarUsuario(rowData, "Editar")
          },
          {
            icon:'delete', 
            tooltip:'Eliminar usuario',
            iconProps: { color: 'secondary' },
            //onClick:(event,rowData) =>window.confirm('Desea eliminar el usuario '+rowData.username+'?')
            onClick: (event, rowData) => seleccionarUsuario(rowData, "Eliminar")
          }
        ]}
        options={{
          actionsColumnIndex: -1,
          headerStyle:{background:'#9cecb0',color:'black',fontWeight: 'bolder'}
        }}
        localization={{
          header:{
            actions: 'Acciones'
          }
        }}

      /> 

        
      <Modal
        open={modalInsertar}
        onClose={abrirCerrarModalInsertar}>
          {bodyInsertar}
      </Modal>

      <Modal
        open={modalEditar}
        onClose={abrirCerrarModalEditar}>
          {bodyEditar}
      </Modal>

      <Modal
        open={modalEliminar}
        onClose={abrirCerrarModalEliminar}>
          {bodyEliminar}
      </Modal>

    </div>


  );
}

export default App;
