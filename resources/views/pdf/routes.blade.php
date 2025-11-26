<!DOCTYPE html>
<html>
<head>
    <title>Laravel Route List</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width:100%; border-collapse: collapse; }
        th, td { border:1px solid #ccc; padding:6px; text-align:left; }
        th { background:#f1f1f1; }
    </style>
</head>

<body>
<h2>Laravel Route List</h2>
<table>
    <thead>
    <tr>
        <th>Method</th>
        <th>URI</th>
        <th>Name</th>
        <th>Action</th>
        <th>Middleware</th>
    </tr>
    </thead>
    <tbody>
    @foreach ($routes as $r)
        <tr>
            <td>{{ $r['method'] }}</td>
            <td>{{ $r['uri'] }}</td>
            <td>{{ $r['name'] }}</td>
            <td>{{ $r['action'] }}</td>
            <td>{{ $r['middleware'] }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
