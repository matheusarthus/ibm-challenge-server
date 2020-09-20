import Question from '../Models/Question';

class SaveQuestions {
  async index(req, res) {
    const { id } = req.params;

    const questions = await Question.find({
      user_id: id,
    });

    return res.json({ questions });
  }

  async store(req, res) {
    const { id } = req.params;
    const { question } = req.body;

    const questionMongo = await Question.findOne({
      id: question.question_id,
    });

    if (!questionMongo) {
      const newQuestion = await Question.create({
        user_id: id,
        is_answered: question.is_answered,
        question_id: question.question_id,
        title: question.title,
        answer_count: question.answer_count,
        score: question.score,
        view_count: question.view_count,
        creation_date: question.creation_date,
        last_activity_date: question.last_activity_date,
        body: question.body,
        tags: question.tags,
        owner: {
          profile_image: question.owner.profile_image,
          display_name: question.owner.display_name,
          reputation: question.owner.reputation,
        },
      });

      return res.json({ newQuestion });
    }

    return res.status(401).json({ Error: 'Question ready exists' });
  }

  async delete(req, res) {
    const { id } = req.params;

    const question = await Question.findOneAndDelete({
      question_id: id,
    });

    return res.status(204).json(question);
  }
}

export default new SaveQuestions();
