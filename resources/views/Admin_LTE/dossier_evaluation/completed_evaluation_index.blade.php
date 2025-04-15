@extends('layouts.app')
@section('content')




    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Dossier Evaluation</h3>
                            <div class="card-tools">
                            </div>
                        </div>
                        <!-- /.card-header -->
                        <div class="card-body">
                            <div id="example1_wrapper" class="dataTables_wrapper dt-bootstrap4 no-footer ">
                                <table id="example1" class="table table-bordered table-striped dataTable no-footer dtr-inline" role="grid" aria-describedby="example1_info">

                                    <thead>
                                    <tr role="row">
                                        <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Supplier Name: activate to sort column descending" aria-sort="ascending" width="5%">S.N</th>
                                        <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Supplier Name: activate to sort column descending" aria-sort="ascending" width="20%">Dossier Ref Num</th>
                                        <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Supplier Name: activate to sort column descending" aria-sort="ascending" width="20%">Drug</th>
                                        <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Supplier Name: activate to sort column descending" aria-sort="ascending" width="20%">Company</th>
                                        <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Supplier Name: activate to sort column descending" aria-sort="ascending" width="20%">Dossier Assignment Date</th>
                                        <th class="sorting" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Country: activate to sort column ascending" width="20%">Evaluation End Date</th>
                                        <th class="sorting" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Actions: activate to sort column ascending" width="20%">Actions</th></tr>
                                    </thead>
                                    <tbody>
                                    @php($i=1)
                                    @foreach($completed_dossiers as $evaluation)
                                        <tr role="row" class="odd">
                                            <td>{{$i++}}</td>
                                            <td>{{$evaluation->dossier_ref_num}}</td>
                                            <td>Drug</td>
                                            <td>Company</td>
                                            <td tabindex="0" >{{$evaluation->start_time}}</td>
                                            <td tabindex="0" >{{$evaluation->end_time}}</td>
                                            <td>

                                                <a href="{{ route('dossier_evaluation_edit',[$evaluation->id])  }}" class="btn btn-info"><i class="fas fa-eye"></i> </a>

                                            </td>
                                        </tr>
                                    @endforeach
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                    <!-- /.card-body -->
                </div>
            </div>
        </div>
        </div>
    </section>
@endsection



