import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const domains = await getAllDomains();
        return NextResponse.json({ success: true, domains });
    } catch (error) {
        console.error("Error fetching domains:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch domains" }, { status: 500 });
    }
}

async function getAllDomains() {
    const allSites = await prisma.website.findMany({
        select: {
            subdomain: true,
            custom_domain: true,
        },
    });

    console.log("getAllDomains");
    console.log(allSites);

    return allSites.map(({ subdomain, custom_domain }: { subdomain: string | null; custom_domain: string | null; }) => {
        return subdomain
            ? `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
            : custom_domain;
    });
}
