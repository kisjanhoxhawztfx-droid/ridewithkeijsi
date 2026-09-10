async function checkShort(id) {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${id}`, {
      method: "HEAD",
      redirect: "manual"
    });
    console.log(id, "status:", res.status, res.headers.get("location"));
  } catch(e) {
    console.error(id, e.message);
  }
}

// 4RCUBrQfC4I was 1:13 "Episodi i Plote"
// JpJ0gMdQkgs is Episodi 5
await checkShort("4RCUBrQfC4I");
await checkShort("JpJ0gMdQkgs");
