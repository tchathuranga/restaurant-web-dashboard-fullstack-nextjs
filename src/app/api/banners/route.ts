import { NextRequest, NextResponse } from 'next/server';
import { prisma, withLegacyId } from '@/lib/prisma';
import { BANNER_PAGE_KEYS } from '@/component/const/siteBanners';

export const dynamic = 'force-dynamic';

// GET banner images keyed by page
export async function GET() {
  try {
    const banners = await prisma.siteBanner.findMany();
    const data: Record<string, string[]> = {};
    for (const banner of banners) {
      data[banner.page] = banner.images as string[];
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// PUT replace the images of one page's banner. An empty list restores the website's built-in banner.
export async function PUT(request: NextRequest) {
  try {
    const { page, images } = await request.json();

    if (!BANNER_PAGE_KEYS.includes(page)) {
      return NextResponse.json({ success: false, error: 'Unknown page' }, { status: 400 });
    }
    if (!Array.isArray(images) || images.some((url) => typeof url !== 'string' || !/^https:\/\//.test(url))) {
      return NextResponse.json({ success: false, error: 'Images must be a list of https URLs' }, { status: 400 });
    }

    const banner = await prisma.siteBanner.upsert({
      where: { page },
      create: { page, images },
      update: { images },
    });

    return NextResponse.json(
      { success: true, data: withLegacyId(banner), message: 'Banner saved successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save banner' },
      { status: 500 }
    );
  }
}
