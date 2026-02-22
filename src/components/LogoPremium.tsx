import Image from 'next/image';

export default function LogoPremium() {
  return (
    <div className="flex items-center">
      <Image 
        src="/images/Logo.png" 
        alt="BYZCLUB" 
        width={150} 
        height={40}
        className="h-8 w-auto"
        priority
      />
    </div>
  );
}
