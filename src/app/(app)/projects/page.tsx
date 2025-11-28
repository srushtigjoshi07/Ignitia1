import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const projects = [
    {
        name: "Portfolio Website",
        description: "Create a personal portfolio to showcase your skills and projects. A great way to practice HTML, CSS, and basic JavaScript.",
        tags: ["HTML", "CSS", "JavaScript"],
        status: "In Progress"
    },
    {
        name: "E-commerce UI Clone",
        description: "Build the user interface for an e-commerce site. Focus on creating reusable components with React.",
        tags: ["React", "Components", "Styling"],
        status: "Not Started"
    },
    {
        name: "Blogging Platform API",
        description: "Develop a RESTful API for a blogging platform using Node.js and Express. Handle CRUD operations for posts and users.",
        tags: ["Node.js", "Express", "API", "Backend"],
        status: "Not Started"
    },
    {
        name: "Real-time Chat Application",
        description: "Build a chat application using WebSockets for real-time communication between users.",
        tags: ["WebSockets", "Node.js", "Frontend"],
        status: "Not Started"
    }
]

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Mini Projects</h1>
        <p className="text-muted-foreground mt-2">
          Apply your skills with these hands-on projects.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
            <Card key={index} className="flex flex-col">
                <CardHeader>
                    <CardTitle className='font-headline'>{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                   <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                   </div>
                   <div>
                     <Badge variant={project.status === "In Progress" ? "default" : "outline"}>{project.status}</Badge>
                   </div>
                </CardContent>
                <CardContent>
                    <Button className='w-full'>
                       {project.status === "Not Started" ? "Start Project" : "Continue Project"}
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
