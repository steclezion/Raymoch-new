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
                                      <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Supplier Name: activate to sort column descending" aria-sort="ascending" width="20%">Dossier Assignment Date</th>
                                      <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Supplier Name: activate to sort column descending" aria-sort="ascending" width="20%">Days Remaining</th>
                                      <th class="sorting" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Country: activate to sort column ascending" width="20%">Status</th>
                                      <th class="sorting" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Actions: activate to sort column ascending" width="20%">Actions</th></tr>
                                      </thead>
                                      <tbody>
                                        @php($i=1)
                                      @foreach($evaluations as $evaluation)
                                      <tr role="row" class="odd">
                                        <td>{{$i++}}</td>
                                        <td>{{$evaluation->dossier_ref_num}}</td>
                                        <td tabindex="0" >{{$evaluation->assigned_datetime}}</td>
                                        <td tabindex="0" >{{$evaluation->task_duration_days_plan -$evaluation->day_count}} days</td>
                                        <td tabindex="0" >{{$evaluation->task_status}}</td>
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



