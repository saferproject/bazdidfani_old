import React, { useEffect, useRef } from "react";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import LocationIcon from "../../../assets/images/locationIcon.png";

// تعریف نوع داده‌های ورودی
interface MapProps {
	center: LatLngExpression;
	setCenter?: (center: LatLngExpression) => void;
	disableClick?: boolean;
}

const MapComponent: React.FC<MapProps> = ({ center, setCenter, disableClick }) => {
	// ایجاد رفرنس برای عنصر div نقشه
	const mapContainerRef = useRef<HTMLDivElement>(null);
	// ایجاد رفرنس برای نگهداری نمونه نقشه
	const mapInstanceRef = useRef<L.Map | null>(null);
	// ایجاد رفرنس برای نگهداری نمونه مارکر
	const markerRef = useRef<L.Marker | null>(null);

	// تابع راه‌اندازی نقشه
	const initializeMap = () => {
		if (!mapContainerRef.current) return;

		// تمیز کردن نقشه قبلی اگر وجود داشته باشد
		if (mapInstanceRef.current) {
			mapInstanceRef.current.remove();
		}

		// ایجاد آیکون سفارشی
		const customIcon = L.icon({
			iconUrl: LocationIcon,
			iconSize: [38, 38],
		});

		// ایجاد نقشه جدید
		const map = L.map(mapContainerRef.current).setView(center, 13);

		// افزودن تایل لایر به نقشه
		L.tileLayer("http://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}", {
			attribution: '&copy; <a href="https://maps.google.com/">Google Maps</a>',
		}).addTo(map);

		// افزودن مارکر به نقشه
		const marker = L.marker(center, { icon: customIcon, draggable: true }).addTo(map);
		marker.bindPopup("مکان انتخاب شده");

		// رویداد کلیک روی نقشه
		map.on("click", (e) => {
			if (disableClick) return;
			const { lat, lng } = e.latlng;
			marker.setLatLng([lat, lng]);
			setCenter([lat, lng]);
		});

		if (disableClick) marker.dragging.disable();

		// رویداد جابجایی مارکر
		marker.on("dragend", () => {
			const position = marker.getLatLng();
			setCenter([position.lat, position.lng]);
		});

		// ذخیره مراجع نقشه و مارکر
		mapInstanceRef.current = map;
		markerRef.current = marker;
	};

	// اثر جانبی برای راه‌اندازی نقشه
	useEffect(() => {
		initializeMap();

		// پاکسازی در زمان unmount شدن کامپوننت
		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}
			markerRef.current = null;
		};
	}, []); // فقط یک بار در زمان mount شدن کامپوننت اجرا شود

	// اثر جانبی برای به‌روزرسانی موقعیت نقشه و مارکر
	useEffect(() => {
		if (mapInstanceRef.current && markerRef.current) {
			// به‌روزرسانی موقعیت نقشه
			mapInstanceRef.current.setView(center, mapInstanceRef.current.getZoom());

			// به‌روزرسانی موقعیت مارکر
			markerRef.current.setLatLng(center);
		}
	}, [center]); // اجرا شدن در زمان تغییر center

	return (
		<div
			ref={mapContainerRef}
			className="w-full h-full"
		/>
	);
};

export default MapComponent;
