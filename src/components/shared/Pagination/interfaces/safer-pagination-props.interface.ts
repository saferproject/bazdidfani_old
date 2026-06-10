export default interface SaferPaginationProps {
	totalPages: number;
	currentPage?: number;
	itemsPerPage?: number;
	onPageChange: (page: number) => void;
	onItemsPerPageChange: (pageSize: number) => void;
}
