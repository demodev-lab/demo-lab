"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Search, User } from "lucide-react";

export function MembersTab() {
  const [searchQuery, setSearchQuery] = useState("");

  const members = [
    {
      id: 1,
      name: "Sunghyun Ko",
      username: "sunghyun-ko-2330",
      bio: "sunko",
      status: "online",
      joinDate: "Mar 19, 2025",
      location: "",
    },
    {
      id: 2,
      name: "Tim Nelms",
      username: "timothy-nelms-8148",
      bio: "Each step is an action (Verbs), who (Pronoun) you are and finally what stimulates your senses - (nouns).",
      status: "online",
      joinDate: "May 5, 2025",
      location: "Italy",
    },
    {
      id: 3,
      name: "Sean Yoo",
      username: "sean-yoo-9140",
      bio: "Wannabe",
      status: "active",
      lastActive: "4h ago",
      joinDate: "May 4, 2025",
      location: "",
    },
    {
      id: 4,
      name: "호영 정",
      username: "36864206",
      bio: "We run the Al System Maker community AI PM & NLP Engineer (RAG, SLLM)",
      status: "active",
      lastActive: "4h ago",
      joinDate: "Mar 19, 2025",
      location: "korea, suwon",
    },
    {
      id: 5,
      name: "Kim Jeong ryul",
      username: "kim-jeong-ryul-5836",
      bio: "to be... Ilm engineer",
      status: "active",
      lastActive: "4h ago",
      joinDate: "Mar 29, 2025",
      location: "",
    },
    {
      id: 6,
      name: "Ibra Ryz",
      username: "ibra-ryz-5169",
      bio: "Trust in Allah",
      status: "active",
      lastActive: "4h ago",
      joinDate: "May 11, 2025",
      location: "",
    },
    {
      id: 7,
      name: "Andrew Choi",
      username: "andrew-choi-8629",
      bio: "AWS 기반 자동화와 LLM 기반 데이터 분석에 관심이 많은 엔지니어입니다",
      status: "active",
      lastActive: "6h ago",
      joinDate: "Mar 30, 2025",
      location: "",
    },
    {
      id: 8,
      name: "현택 이",
      username: "36593043",
      bio: "TeachingOfPower",
      status: "active",
      lastActive: "10h ago",
      joinDate: "Mar 22, 2025",
      location: "",
    },
  ];

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.bio.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Members</h2>
            <span className="text-sm text-muted-foreground">671</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search members..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
            <TabsTrigger value="online">Online</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-4">
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4 relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-4 right-4"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      CHAT
                    </Button>
                    <div className="flex items-start gap-4 pr-24">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={`/placeholder.svg?text=${member.name.charAt(0)}`}
                        />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{member.name}</h3>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              member.status === "online"
                                ? "bg-green-500"
                                : "bg-amber-500"
                            }`}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          @{member.username}
                        </p>
                        <p className="text-sm mt-1">{member.bio}</p>
                        <div className="text-xs text-muted-foreground mt-2">
                          {member.status === "online" ? (
                            <span>Online now</span>
                          ) : (
                            <span>Active {member.lastActive}</span>
                          )}
                          <span> • Joined {member.joinDate}</span>
                          {member.location && <span> • {member.location}</span>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="admins" className="mt-4">
            <div className="space-y-4">
              {filteredMembers.slice(0, 3).map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4 relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-4 right-4"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      CHAT
                    </Button>
                    <div className="flex items-start gap-4 pr-24">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={`/placeholder.svg?text=${member.name.charAt(0)}`}
                        />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{member.name}</h3>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              member.status === "online"
                                ? "bg-green-500"
                                : "bg-amber-500"
                            }`}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          @{member.username}
                        </p>
                        <p className="text-sm mt-1">{member.bio}</p>
                        <div className="text-xs text-muted-foreground mt-2">
                          {member.status === "online" ? (
                            <span>Online now</span>
                          ) : (
                            <span>Active {member.lastActive}</span>
                          )}
                          <span> • Joined {member.joinDate}</span>
                          {member.location && <span> • {member.location}</span>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="online" className="mt-4">
            <div className="space-y-4">
              {filteredMembers
                .filter((m) => m.status === "online")
                .map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4 relative">
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-4 right-4"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        CHAT
                      </Button>
                      <div className="flex items-start gap-4 pr-24">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={`/placeholder.svg?text=${member.name.charAt(0)}`}
                          />
                          <AvatarFallback>
                            <User className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{member.name}</h3>
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            @{member.username}
                          </p>
                          <p className="text-sm mt-1">{member.bio}</p>
                          <div className="text-xs text-muted-foreground mt-2">
                            <span>Online now</span>
                            <span> • Joined {member.joinDate}</span>
                            {member.location && (
                              <span> • {member.location}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
