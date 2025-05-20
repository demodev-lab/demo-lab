"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  ListIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

export function CalendarTab() {
  const [currentMonth] = useState("May 2025");
  const [currentView, setCurrentView] = useState("month");
  const [currentPage] = useState(1);

  // Sample to-do data for the month
  const todos = {
    5: [{ id: 1, text: "라이브 세션", completed: false }],
    12: [{ id: 2, text: "과제 제출", completed: true }],
    15: [{ id: 3, text: "팀 미팅", completed: false }],
    19: [
      { id: 4, text: "멘토링", completed: false },
      { id: 5, text: "강의 수강", completed: false },
    ],
    26: [{ id: 6, text: "월간 미팅", completed: false }],
  };

  // Generate days for the month view
  const days = Array.from({ length: 35 }, (_, i) => {
    const day = i - 3; // Offset to start from the correct day of week
    return {
      date: day > 0 && day <= 31 ? day : null,
      hasEvent: [5, 12, 19, 26].includes(day),
      todos: day > 0 && day <= 31 ? todos[day] || [] : [],
    };
  });

  // Sample events for the list view
  const events = [
    {
      id: 1,
      title: "QA Call - AI Training",
      date: "Sat, May 24 @ 11pm - 12am",
      platform: "Meet",
      image: "/placeholder.svg?height=200&width=200&text=AI+AUTOMATION",
    },
    {
      id: 2,
      title: "QA Call - AI Training",
      date: "Sat, May 31 @ 11pm - 12am",
      platform: "Meet",
      image: "/placeholder.svg?height=200&width=200&text=AI+AUTOMATION",
    },
  ];

  return (
    <div className="container py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs
              value={currentView}
              onValueChange={setCurrentView}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="month">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  월간형
                </TabsTrigger>
                <TabsTrigger value="list">
                  <ListIcon className="h-4 w-4 mr-1" />
                  목록형
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={currentView} className="w-full">
            <TabsContent value="month" className="mt-0">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm">
                  &lt;
                </Button>
                <div className="font-medium">{currentMonth}</div>
                <Button variant="ghost" size="sm">
                  &gt;
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                  <div key={day} className="py-1 text-sm font-medium">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => (
                  <div
                    key={i}
                    className={`h-24 flex flex-col rounded-md text-sm overflow-hidden ${
                      day.date === null
                        ? "text-muted-foreground opacity-50 bg-transparent"
                        : day.date === 19
                          ? "bg-[#2F80ED] text-white"
                          : "hover:bg-muted"
                    }`}
                  >
                    {day.date !== null && (
                      <>
                        <div className="p-1 font-medium">{day.date}</div>
                        <div className="flex-1 overflow-y-auto p-1">
                          {day.todos.map((todo) => (
                            <div
                              key={todo.id}
                              className={`flex items-center gap-1 text-xs mb-1 ${day.date === 19 ? "text-white" : ""}`}
                            >
                              <CheckCircle2
                                className={`h-3 w-3 ${
                                  todo.completed
                                    ? day.date === 19
                                      ? "text-white"
                                      : "text-green-500"
                                    : "text-gray-300"
                                }`}
                              />
                              <span
                                className={`truncate ${
                                  todo.completed && day.date !== 19
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {todo.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-medium mx-2">{currentMonth}</h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <ListIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/4 max-w-[200px] bg-gray-100 relative">
                        <div className="aspect-square relative">
                          <Image
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <CardContent className="p-4 sm:p-6 flex-1">
                        <p className="text-sm text-muted-foreground mb-1">
                          {event.date}
                        </p>
                        <h3 className="text-xl font-semibold mb-3">
                          {event.title}
                        </h3>
                        <div className="flex items-center">
                          <div className="w-5 h-5 mr-2">
                            <Image
                              src="/placeholder.svg?height=20&width=20&text=G"
                              alt="Google Meet"
                              width={20}
                              height={20}
                              className="object-contain"
                            />
                          </div>
                          <span className="text-muted-foreground">
                            {event.platform}
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8">
                <Button variant="ghost" size="sm" disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full bg-amber-100 border-none"
                  >
                    1
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    1-2 of 2
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage * 5 >= events.length}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
