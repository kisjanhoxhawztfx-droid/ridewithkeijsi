import os
import sys
import subprocess
import imageio_ffmpeg

# YouTube mapping for motorcycles
YOUTUBE_MAP = {
    "Ddl6GLQgPr3": "xX1wyD-4Pig", # Honda X-ADV 2017
    "DdleGWiRARz": "PIvT7XN_Aik", # NAS 125 2025
    "DdjdcIwgYr6": "x-P_EuHzrc8", # Yamaha TMAX 560 2024
    "DdjNJZAAMx5": "3ij1p9fjlps", # Honda CBR 1000RR 2008
    "DdisLBpCd5e": "31fs5NlNLQ8", # BMW C 650 GT / Motorr i shitur
    "DdeXKZEgIwH": "0u9zzNT_PBI", # Honda NC 700 2012
    "Ddd3Pv_uGdP": "jfthXQBXMd0", # Piaggio Beverly 350
    "DdcFLKgR9ef": "ITJ02EEpsi4", # ❌BOOOOOOM❌
    "DdbYn4QAbwH": "udKWucw4Fqo", # Honda SH 300 2017
    "DdZEbhHq40p": "eSv_Ql80ark", # Yamaha Fazer 1000 2010
    "DdYtm_RiICZ": "XrAccxg3dho", # BMW R 1250 GS 40 Years
    "DdYZBO4C6fm": "8AqYmrxt1nI", # BMW R 1200 GS Rallye
    "DdWqMhRqlc6": "8Q09d6VuN1o", # Honda X-ADV 750 (SHITUR)
    "DdWNZ66g0Od": "10hw-cUTijk", # Honda Integra 2013
    "DdV8e-hxR0E": "cb8VXlpDX5U", # Yamaha Tracer 700 2020
    "DdUcoevRRcx": "6SWm4YEnMAk", # Kujdes
    "DdUL8U5OjpQ": "lDIIx0ddFms", # Honda Africa Twin
    "DdUEfCnpDaO": "3_jhuqMxmDc", # Honda Integra 700 2014
    "DdTiUewg3-2": "nbaRpO6XSNg", # Kawasaki ER-6N 2014
    "DdTR52BRaIB": "nbaRpO6XSNg", # Kawasaki ER-6N ❌SHITUR❌
    "DdRztFLRdRt": "RhrDtCAUYRk", # Yamaha DragStar 650
    "DdRmhWYBvO9": "JYRfQCjPDn4", # Yamaha TMAX DX 530 2018
    "DdRceFjs6vt": "oktKx204xXo", # Voge SR3 2025 ❌SHITUR❌
    "DdQ-thVCDWU": "N5fqoo_oTtw", # BMW R 1250 GS Adventure 40 Years
    "DdQpxS9uuvu": "4aOj0aHVAnY", # Harley-Davidson Street Glide
    "DdMyfMoOvyi": "y-1L03OMx_4", # 🏍️ KE MOTORR PËR SHITJE? SILLE DHE SHIT
    "3988890188540656647": "jgC5RdUmct8", # Harley Davidson
}

def main():
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    out_dir = os.path.abspath(os.path.join("public", "videos"))
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"Using ffmpeg: {ffmpeg_exe}")
    print(f"Output directory: {out_dir}")
    print(f"Total videos to download: {len(YOUTUBE_MAP)}")
    
    success_count = 0
    
    for key, yt_id in YOUTUBE_MAP.items():
        dest = os.path.join(out_dir, f"{key}.mp4")
        if os.path.exists(dest) and os.path.getsize(dest) > 100000:
            size_mb = os.path.getsize(dest) / 1024 / 1024
            print(f"[OK] {key}.mp4 already exists ({size_mb:.2f} MB)")
            success_count += 1
            continue
            
        print(f"\n[DOWNLOAD] {key} from YouTube {yt_id}...")
        cmd = [
            sys.executable, "-m", "yt_dlp",
            "--ffmpeg-location", ffmpeg_exe,
            "--js-runtimes", "node",
            "-f", "bestvideo[height<=720]+bestaudio/best[height<=720]/best",
            "--merge-output-format", "mp4",
            "-o", dest,
            f"https://www.youtube.com/watch?v={yt_id}"
        ]
        
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            if res.returncode == 0 and os.path.exists(dest):
                size_mb = os.path.getsize(dest) / 1024 / 1024
                print(f"[SUCCESS] {key}.mp4 downloaded ({size_mb:.2f} MB)")
                success_count += 1
            else:
                print(f"[ERROR] Failed for {key}: {res.stderr[:200]}")
        except Exception as e:
            print(f"[EXCEPTION] {key}: {e}")
            
    print(f"\nFinished! {success_count}/{len(YOUTUBE_MAP)} videos downloaded.")

if __name__ == "__main__":
    main()
