@extends('layouts_admin.app')
@section('content')
<!-- resources/views/home_page_welcome/index.blade.php -->

<!DOCTYPE html>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet">


    <div class="container mt-3" style="max-width: 80%; margin: 0 auto;">

        <div class="d-flex justify-content-between mb-3">
      <h2>Home Page Welcomes</h2>
      <button class="btn btn-primary btn-md addBtn" >Add New</button>
    </div>
    <table id="welcomeTable" class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>First Picture</th>
          <th>Second Picture</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
    </table>
  </div>

 @include('home_page_welcomes.create')
 @include('home_page_welcomes.description')

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
  <script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
  <script>
   $.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});

$(document).on('click', '.description-preview', function () {
  const fullText = decodeURIComponent($(this).data('full'));
  $('#descriptionModalBody').text(fullText);
  $('#descriptionModal').modal('show');
});


let table = $('#welcomeTable').DataTable({
      ajax: '/home-page-welcomes-data',
      columns: [
        // { data: 'id' },
        {data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1; // This gives you 1-based indexing
      }
    },
        { data: 'title' },
        {
  data: 'description',
  render: function(data, type, row) {
    const preview = data.length > 100 ? data.substring(0, 100) + '...' : data;
    return `<span class="text-primary description-preview" style="cursor:pointer" data-full="${encodeURIComponent(data)}">${preview}</span>`;
  }
},
        { data: 'first_picture', render: function(data) {
            return data ? `<img src="/storage/${data}" width="60" height="60"/>` : '';
          }
        },
        { data: 'second_picture', render: function(data) {
            return data ? `<img src="/storage/${data}" width="60" height="60"/>` : '';
          }
        },
        { data: 'status',
  render: function (data) {
    let badgeClass = data === 'active' ? 'success' : 'info';
    return `<span class="badge bg-${badgeClass} text-uppercase">${data}</span>`;
  }},
        { data: null, render: function(data) {
            return `
  <button class='btn btn-warning btn-sm editBtn' data-id='${data.id}'>
    <i class="bi bi-pencil-square"></i> Edit
  </button>
  <div style="margin-bottom: 1em;"></div>
  <button class='btn btn-danger btn-sm deleteBtn' data-id='${data.id}'>
    <i class="bi bi-trash"></i> Delete
  </button>
`;
        },  orderable: false }
      ]
    });

$('#welcomeForm').submit(function(e) {
  e.preventDefault();
  let formData = new FormData(this);
  const id = $('#recordId').val();
  console.log(formData.get('second_picture'));

  const url = id ? `/home-page-welcomes/${id}` : '/home-page-welcomes';
  const method = id ? 'POST' : 'POST'; // We'll spoof PUT for update

  if (id) {
    formData.append('_method', 'PUT'); // Laravel needs this to simulate PUT
  }

  $.ajax({
    type: method,
    url: url,
    data: formData,
    processData: false,
    contentType: false,
    success: function() {
      $('#welcomeModal').modal('hide');
      $('#welcomeForm')[0].reset();
      $('#recordId').val('');
      $('#submitButton').text('Save');
      $('.modal-title').text('Add Welcome');
      table.ajax.reload();
      toastr.success('Saved successfully');
    },
    error: function(xhr) {
  if (xhr.responseJSON?.errors) {
    for (const key in xhr.responseJSON.errors) {
      toastr.error(xhr.responseJSON.errors[key][0]);
    }
  } else {
    toastr.error('Save failed: Due the image format is improperly formed!');
  }
}
  });
});


    $('#welcomeTable').on('click', '.deleteBtn', function () {
      if (!confirm('Are you sure?')) return;
      let id = $(this).data('id');
      $.ajax({
        url: `/home-page-welcomes/${id}`,
        type: 'DELETE',
        data: { _token: '{{ csrf_token() }}' },
        success: function() {
          table.ajax.reload();
          toastr.success('Deleted successfully');
        },
        error: function() {
          toastr.error('Failed to delete');
        }
      });
    });


    $('#welcomeTable').on('click', '.editBtn', function () {
  const id = $(this).data('id');

  $.get(`/home-page-welcomes/${id}`, function (data) {
    $('#recordId').val(data.id);
    $('#title').val(data.title);
    $('#description').val(data.description);
    $('#status').val(data.status);
    $('#submit').html('Update')

    // File inputs can't be pre-filled, so reset them
    $('#first_picture').val('');
    $('#second_picture').val('');

    // Show preview images
    if (data.first_picture) {
      $('#previewFirstPicture').attr('src', '/storage/' + data.first_picture).show();
    } else {
      $('#previewFirstPicture').hide();
    }

    if (data.second_picture) {
      $('#previewSecondPicture').attr('src', '/storage/' + data.second_picture).show();
    } else {
      $('#previewSecondPicture').hide();
    }

    $('.modal-title').text('Edit Welcome');
    $('#welcomeModal').modal('show');
  });
});



$('.addBtn').on('click', function () {
     $('#recordId').val('');
    $('#title').val('');
    $('#description').val('');
    $('#status').val('');
    $('#submit').html('Save')
    $('#previewFirstPicture').hide();
    $('#previewSecondPicture').hide();




    // File inputs can't be pre-filled, so reset them
    $('#first_picture').val('');
    $('#second_picture').val('');
   $('.modal-title').text('Add Welcome');
    $('#welcomeModal').modal('show');

});




function handleImageInput(inputId, previewId, infoId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const info = document.getElementById(infoId);

  input.addEventListener('change', function () {
    const file = this.files[0];
    if (!file || !file.type.startsWith('image/')) {
      preview.style.display = 'none';
      info.innerHTML = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(function (blob) {
          // Replace file with compressed version
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(compressedFile);
          input.files = dataTransfer.files;

          // Preview + info
          preview.src = URL.createObjectURL(blob);
          preview.style.display = 'block';

          const sizeKB = (blob.size / 1024).toFixed(1);
          const formattedSize = sizeKB > 1024
            ? (sizeKB / 1024).toFixed(2) + ' MB'
            : sizeKB + ' KB';

          info.innerHTML = `<strong>Size:</strong> ${formattedSize} &nbsp; <strong>Type:</strong> ${compressedFile.type}`;

        }, 'image/jpeg', 0.7); // Adjust quality here for smaller size
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}

// Apply to both fields
handleImageInput('first_picture', 'previewFirstPicture', 'firstPictureInfo');
handleImageInput('second_picture', 'previewSecondPicture', 'secondPictureInfo');



  </script>


@endsection
