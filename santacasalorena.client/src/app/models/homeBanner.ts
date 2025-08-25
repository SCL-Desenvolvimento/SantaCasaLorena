export interface HomeBanner {
  id: string;
  desktopImageUrl: string;
  tabletImageUrl: string;
  mobileImageUrl: string;
  timeSeconds: number;
  order: number;
  newsId: string | null;
}
