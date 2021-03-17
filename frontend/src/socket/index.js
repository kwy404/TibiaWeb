import openSocket from 'socket.io-client'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const config = require('./../config')
const socket = openSocket(config.configSite.urlApi)
const token = window.localStorage.getItem("token") ? window.localStorage.getItem("token") : null

const estouOnline = () => {
    if(token != null){
        socket.emit('online', {'token': token})
    }
}
socket.on('heartbeat', function(data) {
  console.log(data)
})

export default socket;