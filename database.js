import mongoose from 'mongoose';

const URI = 'mongodb+srv://csluduena:coderhouse@cluster0.xa9uk.mongodb.net/GuitarStore?retryWrites=true&w=majority&appName=Cluster0'; // Reemplaza con tu URI de MongoDB

mongoose.connect(URI, {
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch(error => console.error('Error al conectar a MongoDB:', error));
