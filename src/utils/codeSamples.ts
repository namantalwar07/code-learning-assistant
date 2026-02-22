// CREATE THIS FILE
// Purpose: Sample code templates for quick testing

export const SAMPLE_CODE: {
    javascript: Record<string, string>;
    python: Record<string, string>;
  } = {
    javascript: {
      hello: `console.log("Hello, World!");`,
  
      loop: `for (let i = 0; i < 5; i++) {
    console.log("Count:", i);
  }`,
  
      function: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
  }
  
  console.log("Fibonacci(10):", fibonacci(10));`,
  
      array: `const arr = [1, 2, 3, 4, 5];
  const doubled = arr.map(x => x * 2);
  console.log("Original:", arr);
  console.log("Doubled:", doubled);`,
  
      object: `const person = {
    name: "Alice",
    age: 25,
    greet() {
      console.log(\`Hello, I'm \${this.name}\`);
    }
  };
  
  person.greet();
  console.log("Age:", person.age);`,
    },
  
    python: {
      hello: `print("Hello, World!")`,
  
      loop: `for i in range(5):
      print(f"Count: {i}")`,
  
      function: `def fibonacci(n):
      if n <= 1:
          return n
      return fibonacci(n-1) + fibonacci(n-2)
  
  print("Fibonacci(10):", fibonacci(10))`,
  
      list: `arr = [1, 2, 3, 4, 5]
  doubled = [x * 2 for x in arr]
  print("Original:", arr)
  print("Doubled:", doubled)`,
  
      dict: `person = {
      "name": "Alice",
      "age": 25
  }
  
  print(f"Name: {person['name']}")
  print(f"Age: {person['age']}")`,
    },
  };