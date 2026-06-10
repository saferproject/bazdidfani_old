import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import { StrictMode } from "react";

document.getElementById('root')!.setAttribute('dir', 'rtl')

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<App />
	</StrictMode>
);
