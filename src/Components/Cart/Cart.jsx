import React from 'react';
import {addDoc, collection, getFirestore} from 'firebase/firestore';
import './Cart.css';
import { useCartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import ItemCart from '../ItemCart/itemCart';
import { TextField } from '@mui/material';
import Swal from 'sweetalert2'
import { useState } from 'react';


const initialState ={
    fullName: '',
    address: '' ,
    phone: '',
    email: '',
};

const Cart = () => {
    
    const { cart, totalPrice, clear } = useCartContext();
    const [values, setValues] = useState(initialState);
    const [generatedOrderId, setgeneratedOrderId] = useState ('');

    const handleOnChange = (e) =>{
        const {value, name} = e.target;
        setValues({...values, [name] : value})
        };    

    const order ={
        buyer: {values},
        items: cart.map(product => ({ id: product.id, title: product.title, price: product.price, quantity: product.quantity})),
        total:totalPrice() ,
    }

    const generatedOrder = async () => {
        const db = getFirestore();
        const docRef = await addDoc (collection (db,'orders'),{
            order,
        });
        setgeneratedOrderId(docRef.id);
        console.log(docRef.id);

        function alertEnd(){
                Swal.fire({
                    icon: 'success',
                    title: `Su pedido fue generado exitosamente, la id de su pedido es: ${docRef.id}`,
                    showConfirmButton: false,
                    timer: 5000})
                }
        alertEnd();
    }
    
    if (cart.length === 0) {
        return (
            <div className='center2'>
             <h1 > No se agregaron productos al carrito</h1>
             <Link to= '/'> 
                <button type='button' className='btn btn-primary mb-4'>
                Volver al Home
                </button>
            </Link>
            </div>
        );
    }

    const onSubmit = async (e) => {
		e.preventDefault();
		setValues(initialState);
	};


  

    return (
        <>
            {
              cart.map(product => <ItemCart key={product.id} product={product} />)  
            }
            <div className='buttonClear'>
                <button className='btn btn-danger m-3' onClick={() => clear()}>Vaciar Carrito</button>
            </div>
            <h2 className='txtTotal'> Total: ${totalPrice()}</h2>
            <h1 className='center2'> Para finalizar tu pedido, completa el formulario con tus datos</h1>
            <form className='FormContainer' onSubmit={onSubmit}>
                <TextField 
                placeholder='Nombre completo'
                style={{margin: 10, width: 400}}
                name= 'fullName'
                type='string'
                value= {values.fullName} 
                onChange={handleOnChange}
                />
                        <TextField 
                        placeholder='Dirección'
                        style={{margin: 10, width: 400}}
                        name= 'address'
                        value= {values.address} 
                        onChange={handleOnChange}
                        />
                            <TextField 
                            placeholder='Telefono'
                            style={{margin: 10, width: 400}}
                            type= 'number'
                            name= 'phone'
                            value= {values.phone} 
                            onChange={handleOnChange}
                            />
                                <TextField 
                                placeholder='Email'
                                style={{margin: 10, width: 400}}
                                name= 'email'
                                type= 'email'
                                value= {values.email} 
                                onChange={handleOnChange}
                                />
            <button className='btn btn-warning m-3' onClick={generatedOrder}>Generar orden</button>
            </form>
            {generatedOrderId && <h1 className='center2 txtTotal'> Recuerde que el id de su compra es: {generatedOrderId}</h1> }
           </>     
    )
}

export default Cart