import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { createAdminDb } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const adb = createAdminDb(adminDb!);
    const user = await adb.users.get(id);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const publicProfile: any = {
      id: user.id,
      name: user.full_name,
      avatar: user.image_url,
      role: user.role,
    };

    if (user.role === "mentor" || user.role === "staff") {
      publicProfile.tracks = user.assigned_tracks || [];
    } else if (user.role === "intern") {
      const intern = await adb.internProfiles.get(user.id);
      if (intern) {
        const userSocial = (user as any).social_links || (user as any).socialLinks || (intern as any)?.social_links || {};
        publicProfile.track = intern.track_selected;
        publicProfile.rollNumber = intern.roll_number;
        publicProfile.university = intern.university;
        publicProfile.degree = intern.degree;
        publicProfile.city = intern.city;
        publicProfile.github = intern.github_url || userSocial.github || (user as any).github;
        publicProfile.linkedin = intern.linkedin_url || userSocial.linkedin || (user as any).linkedin;
        publicProfile.instagram = (intern as any).instagram_url || userSocial.instagram || userSocial.twitter || (user as any).instagram;
        publicProfile.portfolio = (intern as any).portfolio_url || userSocial.portfolio || (user as any).portfolio;
        publicProfile.joinedAt = intern.created_at;
      }
    }

    return NextResponse.json({ profile: publicProfile });
  } catch (err: any) {
    console.error("Public Profile API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
