import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import LocationOnRounded from "@mui/icons-material/LocationOnRounded";
import CategoryRounded from "@mui/icons-material/CategoryRounded";

export interface SelectedPlace {
  title: string;
  address: string;
  roadAddress: string;
  category: string;
  description: string;
  telephone: string;
  mapx: string;
  mapy: string;
  link: string;
}

interface PlaceDetailProps {
  place: SelectedPlace;
}

export function PlaceDetail({ place }: PlaceDetailProps) {
  return (
    <div className="px-4 pt-3 pb-8">
      {/* 헤더 */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#3A2E2A] leading-tight">
          {place.title}
        </h2>
        {place.category && (
          <p className="text-xs text-[#9B8B84] mt-1">{place.category}</p>
        )}
      </div>

      {/* 사진 placeholder */}
      <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-[#FFF2EB] to-[#FFDCDC] flex items-center justify-center mb-4 overflow-hidden">
        <span className="text-4xl">🗺️</span>
      </div>

      {/* 정보 목록 */}
      <div className="flex flex-col gap-3">
        {(place.roadAddress || place.address) && (
          <div className="flex items-start gap-2.5">
            <LocationOnRounded
              sx={{ fontSize: 16, color: "#9B8B84", flexShrink: 0, mt: "1px" }}
            />
            <p className="text-sm text-[#6B5B56] leading-snug">
              {place.roadAddress || place.address}
            </p>
          </div>
        )}
        {place.telephone && (
          <div className="flex items-center gap-2.5">
            <PhoneRounded
              sx={{ fontSize: 16, color: "#9B8B84", flexShrink: 0 }}
            />
            <p className="text-sm text-[#6B5B56]">{place.telephone}</p>
          </div>
        )}

        {place.description && (
          <p className="text-sm text-[#9B8B84] leading-relaxed mt-1">
            {place.description}
          </p>
        )}
      </div>

      {/* 네이버 플레이스 링크 */}
      {place.link && (
        <a
          href={place.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-1.5 w-full py-3 rounded-2xl bg-[#FFF2EB] text-sm font-medium text-[#3A2E2A] hover:bg-[#FFDCDC] transition-colors"
        >
          네이버 플레이스에서 보기
          <OpenInNewRounded sx={{ fontSize: 14 }} />
        </a>
      )}
    </div>
  );
}
