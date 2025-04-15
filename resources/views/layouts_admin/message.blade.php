<section class="content">
<div class="container-fluid" id="alert-messages">
    @if(session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert" id="success-alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">×</button>
        <h5><i class="icon fas fa-check"></i> Success</h5>
        {{ session('success') }}
    </div>
    @elseif(session('warning'))

        <div class="alert alert-warning alert-dismissible">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        <h5><i class="icon fas fa-exclamation-triangle"></i> Warning</h5>
            {{session('warning')}}
        </div>

    @elseif(session('danger'))
        <div class="alert alert-danger alert-dismissible">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        <h5><i class="icon fas fa-ban"></i> Error!</h5>
            {{session('danger')}}
        </div>

    @elseif(session('info'))
        <div class="alert alert-info alert-dismissible">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        <h5><i class="icon fas fa-info"></i> Information</h5>
            {{session('info')}}
        </div>
    

    @elseif ($errors->any())
    <div class="alert alert-danger">
        <strong>There were some problems:</strong>
        <ul class="mb-0">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif
</div>
</section>




<script>
    setTimeout(function () {
        const alert = document.getElementById('success-alert');
        if (alert) {
            alert.classList.remove('show');
            alert.classList.add('fade');
            alert.style.transition = 'opacity 0.6s';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 600); // remove it after fade out
        }
    }, 3000); // 3 seconds
</script>


<script>
    // Fade out all alerts after 3.5 seconds
    setTimeout(() => {
        const alerts = document.querySelectorAll('#alert-messages .alert');
        alerts.forEach(alert => {
            alert.classList.remove('show');
            alert.classList.add('fade');
            alert.style.transition = 'opacity 0.6s';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 600); // remove after fade
        });
    }, 3500);
</script>



