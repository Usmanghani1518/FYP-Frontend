export function filterAndPaginate<T extends { [key: string]: unknown }>(
    items: T[],
    search = "",
    currentPage = 1,
    itemsPerPage = 10,
    pageNumbersCount = 7,
) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    // Search
    let filteredItems = items;
    if (search)
        filteredItems = items.filter(item =>
            Object.keys(item).some(key =>
                item[key]
                    ?.toString()
                    .toLocaleLowerCase()
                    .indexOf(search.toLocaleLowerCase()) !== -1
            )
        );

    // Pages Count
    const pagesCount = Math.ceil(filteredItems.length / itemsPerPage);


    // Paginate
    filteredItems = filteredItems.slice(start, end);


    // Page Numbers
    const pageNumbers: number[] = [];
    if (currentPage > 0) {
        let toUnshift = currentPage;

        let i = 3;
        do {
            pageNumbers.unshift(toUnshift);
        } while (--i > 0 && --toUnshift > 0);
    }
    while (pageNumbers.length < pageNumbersCount) {
        const toPush = pageNumbers[pageNumbers.length - 1] + 1;
        const toUnshift = pageNumbers[0] - 1;
        if (toPush <= pagesCount)
            pageNumbers.push(toPush);
        else if (toUnshift > 0)
            pageNumbers.unshift(toUnshift);
        else
            break;
    }

    return {
        filteredItems,
        pagesCount,
        pageNumbers
    };
}