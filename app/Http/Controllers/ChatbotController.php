<?php

namespace App\Http\Controllers;

use App\Models\Chatbot;
use Illuminate\Http\Request;
//use OpenAI;
use OpenAI\Laravel\Facades\OpenAI;

class ChatbotController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

 /**
     * Respond the form for creating a new resource.
     */
    public function respond(Request $request)
    {
        $raymochInfo = "Raymoch is a modern business ... Empower East African businesses by providing a digital platform to showcase their products and services globally Bridge the gap between local businesses and international markets through networking, digital marketing, and technology-driven solutions. Facilitate trade by offering resources, insights, and connections that enhance global business opportunities for East African entrepreneurs. Promote economic development by enabling small and large businesses to expand beyond regional borders and attract international investors.";

        $response = OpenAI::chat()->create([
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'system', 'content' => "You are an assistant trained on this company: {$raymochInfo}"],
                ['role' => 'user', 'content' => $request->message],

            ],
        ]);

        return response()->json(['reply' => $response->choices[0]->message->content]);
    }


    public function reply(Request $request)
{
    $userMessage = $request->input('message');

    $response = OpenAI::chat()->create([
        'model' => 'gpt-3.5-turbo', // or 'gpt-4'
        'messages' => [
            ['role' => 'system', 'content' => 'You are a helpful assistant.'],
            ['role' => 'user', 'content' => $userMessage],
        ],
    ]);

    $botMessage = $response->choices[0]->message->content;

    return response()->json(['reply' => $botMessage]);
}


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Chatbot $chatbot)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Chatbot $chatbot)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Chatbot $chatbot)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Chatbot $chatbot)
    {
        //
    }
}
