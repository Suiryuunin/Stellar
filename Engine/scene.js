let aur = 0;

class Scene
{
    constructor()
    {
        this.el = new LinkedList(true);

        // Colliders per Section
        this.cps = [];
        for (let i = 0; i < 16; i++)
            this.cps[i] = [];
    }

    init(value)
    {
        this.el.init(value);
    }

    add(value)
    {
        this.el.addNode(value);
    }

    addBulk(valArray)
    {
        this.el.addBulk(valArray);
    }

    deleteItem(value)
    {
        this.el.deleteNode(value);
    }

    size()
    {
        return this.el.size();
    }

    // collisionsWith(object, callback = undefined, rR = undefined, rRR = undefined)
    // {
    //     for (let i = 0; i < this.el.size(); i++)
    //     {
    //         const obj = this.el.arr[i];
    //         if (object.visible && !(object === obj) && object.collideWith(obj, rR, rRR))
    //         {
    //             if (callback != undefined) callback(obj);
    //         }
    //     }
    // }

    toExplode()
    {
        let arr = [];
        for (const section of this.cps)
        {
            for (let i = 0; i < section.length; i++)
            {
                if (section[i].collide) for (let j = i+1; j < section.length; j++)
                {
                    if (section[j].collide && !(section[i].type == "frag" && section[j].type == "frag") && section[i].collider.collidesWith(section[j].collider))
                    {
                        if (!section[i].anchor)
                        {
                            // Vector in between circles
                            const v = section[i].t.pos.sub(section[j].t.pos);
                            const d = section[i].t.radius+section[j].t.radius - v.mag();

                            section[i].t.pos = section[i].t.pos.add(v.normalized().scalar(d));
                        }
                        arr.push(section[i],section[j]);
                    }
                }
            }
        }
        return arr;
    }
    explode(toDestroy, anchors, planets)
    {
        for (const planet of toDestroy)
        {
            if (planet.id != 0 && !planet.anchor)
            {
                A_Crash(Math.round(Math.random()*3));

                planet.explode(this, anchors, planets);
            }
        }
    }

    activate()
    {
        for (let i = 0; i < this.el.size(); i++)
        {
            const obj = this.el.arr[i];
            if (obj.activate) obj.activate();
        }
    }
    deactivate()
    {
        for (let i = 0; i < this.el.size(); i++)
        {
            const obj = this.el.arr[i];
            if (obj.deactivate) obj.deactivate();
        }
    }

    update(dt)
    {
        this.cps = [];
        for (let i = 0; i < 16; i++)
            this.cps[i] = [];
        for (let i = 0; i < this.el.size(); i++)
        {
            this.el.arr[i].update(dt);
            if (this.el.arr[i].collider != undefined)
            {
                for (let j = 0; j < this.el.arr[i].collider.bounds.sect1.length; j++)
                {
                    this.cps[this.el.arr[i].collider.bounds.sect1[j]].push(this.el.arr[i]);
                }
            }
        }
    }

    render(rr)
    {
        for (let i = 0; i < this.el.size(); i++)
        {
            const obj = this.el.arr[i];
            if (obj.visible) obj.render(rr);
        }
    }
}