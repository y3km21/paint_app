function addDiv() {
  const hello_div = document.createElement("div");
  hello_div.id = "description";
  hello_div.textContent = "Aim for dxxxr!";
  return hello_div;
}

export { addDiv };
