export default function formatPagination(page:number, limit:number, total: number) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    }
}