"use client";

import { useUser } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [loading, setLoading] = useState(true);

  const userAvatar = PlaceHolderImages.find((p) => p.id === "user-avatar-1");

  useEffect(() => {
    if (user && firestore) {
      const fetchProfile = async () => {
        setLoading(true);
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.displayName || user.displayName || '');
          setCurrentSkills(data.currentSkills || '');
          setLearningGoals(data.learningGoals || '');
        } else {
           setName(user.displayName || '');
        }
        setLoading(false);
      };

      fetchProfile();
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [user, firestore, userLoading]);

  const handleSaveChanges = async () => {
    if (!user || !firestore) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save your profile.",
      });
      return;
    }

    try {
      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, {
        displayName: name,
        email: user.email,
        currentSkills,
        learningGoals,
      }, { merge: true });
      toast({
        title: "Profile Saved!",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not save your profile. Please try again.",
      });
    }
  };
  
  if (loading || userLoading) {
    return <div>Loading profile...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and learning preferences.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {user?.photoURL ? (
                <AvatarImage src={user.photoURL} alt="User Avatar" />
              ) : (
                userAvatar && (
                  <AvatarImage
                    src={userAvatar.imageUrl}
                    alt="User Avatar"
                    data-ai-hint={userAvatar.imageHint}
                  />
                )
              )}
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Avatar</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email || ''} disabled />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Skills & Goals</CardTitle>
          <CardDescription>
            This information helps us personalize your learning experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current-skills">Current Skills</Label>
            <Textarea
              id="current-skills"
              rows={4}
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              placeholder="e.g., Proficient in HTML/CSS, beginner in JavaScript."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="learning-goals">Learning Goals</Label>
            <Textarea
              id="learning-goals"
              rows={4}
              value={learningGoals}
              onChange={(e) => setLearningGoals(e.target.value)}
              placeholder="e.g., Become a full-stack developer."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </div>
  );
}
