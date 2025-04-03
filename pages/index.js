import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import Header from '../components/Header';
import React, { useEffect } from 'react';

export default function Home() {
	useEffect(() => {
		console.log("BOM DIA");
		// Inside a React component or page
		fetch(`/api/figmaComments?fileKey=kmmbixTzsL8ziamYK8NRNj`)
			.then((res) => res.json())
		  	.then((data) => {
		    	console.log(data); // Handle the response data
		  	})
		  	.catch((error) => {
		   		console.error('Error fetching comments:', error);
		  	});
	}, []); // The empty array [] means this effect runs once after the initial render
    return (
        <div className={ styles.container }>
            <Header />
            <p className={ styles.paragraphText }>This is text centered</p>
        </div>
    )
}
