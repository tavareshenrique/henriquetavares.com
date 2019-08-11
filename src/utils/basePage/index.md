---
title: Title Here
date: '1997-01-06'
spoiler: I Hate Spoilers

[Linked Content](https://henriquetavares.com) and an `emphasis`.

* 🤔 Topics 1
* 🤔 Topics 2
* 🤔 Topics 3

**Bold content**

>“Unlearn what you have learned.” — Yoda

![Yoda sniffing the air. Caption: “I smell bacon.”](./yoda.jpg)

---

## Continue

More content here.

## Each Render Has Its Own Props and State

Code below:

```jsx{6}
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```