import { MapPin, Mail } from 'lucide-react';
import { ProfileData } from '@/shared/data/core/profile-data/profile-data';

export function ProfilePreview() {
  return (
    <div className="flex flex-col gap-4">

      
      <div className="rounded-2xl overflow-hidden w-full h-[200px] bg-neutral-100">
        <img
          src={ProfileData.preview}
          alt={ProfileData.companyName}
          className="w-full h-full object-cover"
        />
      </div>

    
      <div>
        <p className="text-xl font-bold">{ProfileData.companyName}</p>
        <p className="text-[12px] uppercase tracking-widest text-muted-foreground mt-0.5">
          {ProfileData.location}
        </p>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {ProfileData.description}
      </p>

      
      <div className="flex flex-wrap gap-1.5">
       {ProfileData.curatorsType.map((tag) => (
  <span
    key={tag.label}
    className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary"
  >
    {tag.label}
  </span>
))}
      </div>

    
      <div className="flex flex-col gap-1">
        <p className="text-[12px] uppercase tracking-widest text-muted-foreground">Lead Time</p>
        <p className="text-sm font-semibold">{ProfileData.leadTime}</p>
        <button className="text-sm text-secondary underline underline-offset-2 text-left">
          Company's Terms of Use
        </button>
      </div>

     
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{ProfileData.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{ProfileData.email}</span>
        </div>
      </div>

    </div>
  );
}