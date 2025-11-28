"use client"

import Link from "next/link"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ArrowRight, Bell, ClipboardCheck, Target } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

const chartData = [
  { skill: "JS", level: 80 },
  { skill: "React", level: 75 },
  { skill: "Next.js", level: 60 },
  { skill: "Node.js", level: 50 },
  { skill: "Python", level: 40 },
  { skill: "UI/UX", level: 85 },
];

const chartConfig = {
  level: {
    label: "Skill Level",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">Welcome back, Learner!</h1>
        <p className="text-muted-foreground">Here is a snapshot of your learning journey.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Skill Mastery</CardTitle>
            <CardDescription>Your current proficiency levels across different skills.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="skill"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="level" fill="var(--color-level)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Target className="h-6 w-6"/>
              Learning Path
            </CardTitle>
            <CardDescription>Your personalized roadmap to success.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>Your journey to master Full-Stack Development is underway. Keep up the great work!</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/learning-path">
                View Your Path <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6"/>
              Mini Projects
            </CardTitle>
            <CardDescription>Apply your skills with hands-on projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">Portfolio Website:</span> In Progress</li>
                <li><span className="font-semibold">E-commerce UI:</span> Not Started</li>
                <li><span className="font-semibold">Blogging Platform:</span> Not Started</li>
            </ul>
          </CardContent>
           <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/projects">Explore Projects</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Notifications
            </CardTitle>
            <CardDescription>Recent updates and reminders.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p><span className="font-semibold">New course available:</span> Advanced TypeScript. <Link href="#" className="text-primary underline">Enroll now</Link>.</p>
              </li>
               <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p><span className="font-semibold">Exam Reminder:</span> JavaScript Basics exam is in 3 days.</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
