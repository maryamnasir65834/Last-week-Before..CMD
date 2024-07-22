$(document).ready(function() {
    let currentPage = 1;
    const pageSize = 10;

    function displayBooks(books) {
        console.log('Displaying books:', books);
        $('tbody').empty();
        if (books.length === 0) {
            $('tbody').append('<tr><td colspan="6">No books found</td></tr>');
        } else {
            books.forEach(function(book) {
                $('tbody').append(
                    `<tr>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.description}</td>
                        <td><img src="${book.imageUrl}" alt="${book.title}" style="width: 100px; height: auto;"></td>
                        <td>${book.price}</td>
                        <td>${book.availability}</td>
                    </tr>`
                );
            });
        }
    }
    

    function fetchBooks(query = '', page = 1, pageSize = 10) {
        console.log('Fetching books with query:', query, 'page:', page, 'pageSize:', pageSize);
        $.ajax({
            url: 'https://localhost:7268/api/Books',
            type: 'GET',
            dataType: 'json',
            data: {
                title: query,
                page: page,
                pageSize: pageSize
            },
            success: function(data) {
                console.log('Books data received:', data);
                displayBooks(data.books);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error fetching books:', textStatus, errorThrown);
            }
        });
    }

    $('#search-bar').on('input', function() {
        var query = $(this).val();
        currentPage = 1;
        fetchBooks(query, currentPage);
    });

    $('#load-more-btn').click(function() {
        currentPage++;
        var query = $('#search-bar').val();
        fetchBooks(query, currentPage);
    });

    $('#add-book-form').on('submit', function(e) {
        e.preventDefault();

        var newBook = {
            title: $('#title').val(),
            author: $('#author').val(),
            description: $('#description').val(),
            imageUrl: $('#imageUrl').val(),
            price: parseFloat($('#price').val()), // Ensure price is parsed as a float
            availability: $('#availability').val()
        };

        $.ajax({
            url: 'https://localhost:7268/api/Books',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newBook),
            success: function() {
                $('#add-book-form')[0].reset();
                currentPage = 1;
                fetchBooks($('#search-bar').val(), currentPage);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error adding book:', textStatus, errorThrown);
                // Optional: Display a message to the user
            }
        });
    }); 
}); 